import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HandPointing } from 'phosphor-react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { Dialog, Transition } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useAuth } from '../hooks/useAuth'
import { usePokerRoom, votingSystems } from '../hooks/usePokerRoom'
import { database, ref, update } from '../services/firebase'

import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/Poker/Cards'
import { PokerTable } from '../components/Poker/Table'
import { Input } from '../components/Common/Input'
import { Button } from '../components/Common/Button'

type PokerRoomParams = {
  id: string
}

type TablePlayersData = {
  id: string
  name: string
  selectedCard: string | null
}

type GuestUserFormData = {
  username: string
}

const schema = Yup.object().shape({
  username: Yup.string().required('Nome obrigatório')
})

export const PokerRoom = () => {
  const { id } = useParams<PokerRoomParams>()
  const { user, signInAsAnonymous } = useAuth()
  const { title, votingSystem, players, owner, isShowingCards } = usePokerRoom(
    user ? id : undefined
  )
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [votingSystemOptions, setVotingSystemOptions] = useState<string[]>([])
  const [tablePlayers, setTablePlayers] = useState<TablePlayersData[][]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [roomOptions, setRoomOptions] = useState<
    { label: string; onClick: () => void }[]
  >([])
  const [isShowingRoundsHistory, setIsShowingRoundsHistory] = useState(false)
  const [isShowingGuestUserAuth, setIsShowingGuestUserAuth] = useState(false)

  const handleSelectCard = async (value: string) => {
    const tableUser = tablePlayers
      .flat()
      .find(tableUser => tableUser.id === user?.id)

    if (!tableUser) return
    if (tableUser.selectedCard !== value) {
      await update(ref(database), {
        [`pokerRooms/${id}/players/${user?.id}`]: {
          name: user?.name,
          selectedCard: value
        }
      })

      setSelectedOption(value)
    } else {
      await update(ref(database), {
        [`pokerRooms/${id}/players/${user?.id}`]: {
          name: user?.name,
          selectedCard: null
        }
      })
      setSelectedOption(null)
    }
  }

  const handleShowCards = async () => {
    try {
      if (selectedOption) {
        if (!isShowingCards) {
          await update(ref(database), {
            [`pokerRooms/${id}/rounds/${uuidv4()}`]: players
          })
        }

        await update(ref(database), {
          [`pokerRooms/${id}/showingCards`]: !isShowingCards
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível registrar rodada')
    }
  }

  const handleCopyRoomCodeToClipboard = () => {
    if (id) {
      navigator.clipboard.writeText(id)
      toast.success('Código copiado!')
    }
  }

  const handleFinishRoom = () => {
    console.log('handleFinishRoom')
  }

  const handleSeeRoundsHistory = () => {
    console.log('handleSeeRoundsHistory')
    setIsShowingRoundsHistory(!isShowingRoundsHistory)
  }

  const handleGuestUserLogin = async ({ username }: GuestUserFormData) => {
    try {
      const userStatus = await signInAsAnonymous(username)
      if (!userStatus) {
        throw new Error('Invalid anonymous user')
      }

      await update(ref(database), {
        [`pokerRooms/${id}/players/${userStatus.id}`]: {
          name: userStatus.name,
          selectedCard: null
        }
      })
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível acessar sala')
    }
  }

  useEffect(() => {
    if (!user || !players.find(player => player.id === user.id)) {
      setIsShowingGuestUserAuth(true)
      return
    }

    setIsShowingGuestUserAuth(false)

    if (votingSystem === '') return

    setVotingSystemOptions(votingSystems[votingSystem])

    const parsedPlayers = players
      .sort(a => (a.id === user?.id ? -1 : 0))
      .reduce(
        (playersByCategory, player, idx) => {
          playersByCategory[idx % 4].push(player)
          return [...playersByCategory]
        },
        [[], [], [], []] as TablePlayersData[][]
      )

    setTablePlayers(parsedPlayers)

    const tableUser = players.find(players => players.id === user.id)

    if (tableUser && tableUser.selectedCard !== selectedOption) {
      setSelectedOption(tableUser.selectedCard)
    }

    const roomDropdownOptions = [
      {
        label: 'Copiar link',
        onClick: () => handleCopyRoomCodeToClipboard()
      }
      // {
      //   label: 'Histórico de votação',
      //   onClick: () => handleSeeRoundsHistory()
      // }
    ]

    if (user && user.id === owner) {
      roomDropdownOptions.push({
        label: 'Encerrar sala',
        onClick: () => handleFinishRoom()
      })
    }

    setRoomOptions(roomDropdownOptions)
  }, [user, players, votingSystem])

  return (
    <>
      {user && (
        <>
          <Header
            username={user.name}
            avatar={user.avatar}
            roomCode={id}
            roomName={title}
            roomOptions={roomOptions}
          />

          <main className="py-4 px-10">
            <section>
              <div className="flex items-center justify-center">
                <PokerTable
                  players={tablePlayers}
                  isShowingCards={isShowingCards}
                  isShowingToggleButton={user.id === owner && !!selectedOption}
                  handleShowCards={handleShowCards}
                />
              </div>

              <div>
                <p className="flex items-center justify-center gap-1">
                  Escolha sua carta
                  <HandPointing size="20" className="rotate-180" />
                </p>

                <div className="flex justify-center items-center gap-2 my-4">
                  {votingSystemOptions.map(card => (
                    <PokerCards
                      key={card}
                      label={card}
                      isActive={selectedOption === card}
                      selectCard={() => handleSelectCard(card)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      <Transition appear show={isShowingGuestUserAuth} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 flex items-center justify-center"
          onClose={handleSeeRoundsHistory}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed flex items-center justify-center inset-0 bg-black/25">
              <Dialog.Panel
                className="
                  w-full
                  max-w-md
                  transform
                  overflow-hidden
                  rounded-2xl
                  bg-white p-6
                  text-left
                  align-middle
                  shadow-xl
                  transition-all"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Escolha seu nome de exibição
                </Dialog.Title>

                <div className="mt-2">
                  <form
                    onSubmit={handleSubmit(data =>
                      handleGuestUserLogin(data as GuestUserFormData)
                    )}
                    className="flex flex-col"
                  >
                    <Input
                      placeholder="Digite seu nome"
                      name="username"
                      errors={errors.username}
                      register={name => register(name)}
                    />

                    <Button
                      type="submit"
                      color="bg-violet-600"
                      text-color="text-white"
                    >
                      Entrar na Sala
                    </Button>
                  </form>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition appear show={isShowingRoundsHistory} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 flex items-center justify-center"
          onClose={handleSeeRoundsHistory}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed flex items-center justify-center inset-0 bg-black/25">
              <Dialog.Panel
                className="
                  w-full
                  max-w-md
                  transform
                  overflow-hidden
                  rounded-2xl
                  bg-white p-6
                  text-left
                  align-middle
                  shadow-xl
                  transition-all"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Histórico de votação
                </Dialog.Title>

                <div className="mt-2"></div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
