import React, { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'phosphor-react'
import { format, formatISO, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Dialog, Transition } from '@headlessui/react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '../hooks/useAuth'
import {
  database,
  ref,
  set,
  get,
  query,
  limitToLast,
  orderByChild,
  equalTo,
  onValue
} from '../services/firebase'

import { Header } from '../components/Header/Index'
import { GameCards } from '../components/Dashboard/GameCards'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Select } from '../components/Common/Select'

type PokerFormData = {
  pokerRoomName: string
  votingSystem: string
}

type UserRooms = {
  id: string
  title: string
  createdAt: string
  rounds: number
}

type DBUserRooms = {
  title: string
  createdAt: string
  rounds?: {
    [key: string]: {
      id: string
      name: string
      selectedCard: string
    }[]
  }
}

const pokerSchema = Yup.object().shape({
  pokerRoomName: Yup.string()
    .required('Nome da sala obrigatório')
    .min(3, 'Nome da sala deve ter no mínimo 3 caracteres')
    .max(20, 'Nome da sala deve ter no máximo 20 caracteres'),
  votingSystem: Yup.string().required('Campo obrigatório')
})

export const Dashboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(pokerSchema)
  })

  const navigate = useNavigate()
  const { user } = useAuth()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [userRooms, setUserRooms] = useState<UserRooms[] | undefined>(undefined)

  const handleOpenNewRoomModal = () => {
    if (!userRooms || (userRooms && userRooms.length < 5)) {
      setIsCreatingRoom(true)
    } else {
      toast.error('Você atingiu o limite de jogos simultâneos')
    }
  }

  const handleCreateRoom = async ({
    pokerRoomName,
    votingSystem
  }: PokerFormData) => {
    try {
      if (!user?.id) {
        throw new Error('Invalid user')
      }

      const pokerRoomId = uuidv4()
      const pokerRoomRef = ref(database, `pokerRooms/${pokerRoomId}`)
      await set(pokerRoomRef, {
        title: pokerRoomName,
        votingSystem,
        ownerId: user?.id,
        showingCards: false,
        createdAt: formatISO(new Date())
      })

      const pokerRoomPlayersRef = ref(
        database,
        `pokerRooms/${pokerRoomId}/players`
      )
      await set(pokerRoomPlayersRef, {
        [user.id]: {
          name: user.name,
          selectedCard: null
        }
      })

      navigate(`/poker-room/${pokerRoomId}`)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível criar uma sala')
    }
  }

  useEffect(() => {
    reset()
  }, [isCreatingRoom])

  useEffect(() => {
    if (user) {
      const pokerRoomsRef = ref(database, `pokerRooms`)

      const recentPostsRef = query(
        pokerRoomsRef,
        orderByChild('ownerId'),
        equalTo(user.id),
        limitToLast(5)
      )

      get(recentPostsRef).then(snapshot => {
        if (snapshot.exists()) {
          const rooms = Object.entries(
            snapshot.val() as { [key: string]: DBUserRooms }
          )
          if (rooms.length > 0) {
            const parsedRooms = rooms.map(([roomId, roomData]) => {
              return {
                id: roomId,
                title: roomData.title,
                createdAt: roomData.createdAt,
                rounds: roomData.rounds
                  ? Object.keys(roomData.rounds).length
                  : 0
              }
            })

            setUserRooms(parsedRooms)
          }
        }
      })

      onValue(pokerRoomsRef, room => {
        const databaseRoom = room.val()

        if (databaseRoom) {
          const rooms = Object.entries(
            databaseRoom as { [key: string]: DBUserRooms }
          )
          if (rooms.length > 0) {
            const parsedRooms = rooms.map(([roomId, roomData]) => {
              return {
                id: roomId,
                title: roomData.title,
                createdAt: roomData.createdAt,
                rounds: roomData.rounds
                  ? Object.keys(roomData.rounds).length
                  : 0
              }
            })

            setUserRooms(parsedRooms)
          }
        }
      })
    }
  }, [user])

  return (
    <>
      {user && (
        <>
          <Header username={user.name} avatar={user.avatar} />

          <main className="py-4 px-10">
            <section>
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-3xl">Meus jogos</h1>
                  <span className="bg-zinc-300 rounded-xl py-1 px-2 text-sm">
                    {userRooms
                      ? userRooms.length > 1
                        ? `${userRooms.length} jogos`
                        : `${userRooms.length} jogo`
                      : '0 jogo'}
                  </span>
                </div>

                <p className="">
                  Crie até 5 planning poker simultâneos e compartilhe a URL com
                  seu time
                </p>
              </div>

              <div className="flex gap-6 py-10">
                <button
                  className="
                    bg-transparent
                    border-2
                    border-violet-500
                    border-dashed
                    rounded-lg
                    flex
                    flex-col
                    justify-center
                    items-center
                    p-6
                    hover:opacity-75
                    transition-all
                    duration-150
                    ease-linear"
                  onClick={() => handleOpenNewRoomModal()}
                >
                  <PlusCircle
                    size="50"
                    weight="light"
                    className="text-violet-500"
                  />
                  <p className="text-violet-500">Novo jogo</p>
                </button>

                {userRooms
                  ? userRooms.map(room => (
                      <GameCards
                        key={room.id}
                        id={room.id}
                        title={room.title}
                        date={format(parseISO(room.createdAt), 'dd MMM yyyy', {
                          locale: ptBR
                        })}
                        url={room.id}
                        rounds={room.rounds}
                        scoresHeight={[
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]',
                          'h-[0rem]'
                        ]}
                      />
                    ))
                  : undefined}
              </div>
            </section>
          </main>

          <Transition appear show={isCreatingRoom} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10 flex items-center justify-center"
              onClose={() => setIsCreatingRoom(false)}
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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Escolha o nome e o sistema de votação para o seu jogo
                    </Dialog.Title>

                    <div className="mt-2">
                      <form
                        className="flex flex-col"
                        onSubmit={handleSubmit(data =>
                          handleCreateRoom(data as PokerFormData)
                        )}
                      >
                        <Input
                          label="Nome da sala"
                          name="pokerRoomName"
                          register={name => register(name)}
                          errors={errors.pokerRoomName}
                        />
                        <Select
                          label="Sistema de votação"
                          name="votingSystem"
                          options={[
                            {
                              label:
                                'Fibonacci (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?)',
                              value: 'fibonacci'
                            }
                          ]}
                          register={name => register(name)}
                          errors={errors.votingSystem}
                        />

                        <div className="mt-4">
                          <Button
                            type="submit"
                            color="bg-violet-600"
                            text-color="text-white"
                          >
                            Criar sala
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        </>
      )}
    </>
  )
}
