import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HandPointing } from 'phosphor-react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '../hooks/useAuth'
import { usePokerRoom, votingSystems } from '../hooks/usePokerRoom'
import { database, ref, update } from '../services/firebase'

import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/Poker/Cards'
import { PokerTable } from '../components/Poker/Table'

type PokerRoomParams = {
  id: string
}

type TablePlayersData = {
  id: string
  name: string
  selectedCard: string | null
}

export const PokerRoom = () => {
  const { id } = useParams<PokerRoomParams>()
  const { user } = useAuth()
  const { title, votingSystem, players, owner } = usePokerRoom(id)

  const [votingSystemOptions, setVotingSystemOptions] = useState<string[]>([])
  const [tablePlayers, setTablePlayers] = useState<TablePlayersData[][]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isShowingCards, setIsShowingCards] = useState(false)

  const handleSelectCard = async (value: string) => {
    if (isShowingCards) return

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
    if (selectedOption) {
      if (!isShowingCards) {
        try {
          await update(ref(database), {
            [`pokerRooms/${id}/rounds/${uuidv4()}`]: players
          })

          setIsShowingCards(!isShowingCards)
        } catch (error) {
          console.log(error)
          toast.error('Não foi possível registrar rodada')
        }
      } else {
        setIsShowingCards(!isShowingCards)
      }
    }
  }

  useEffect(() => {
    if (votingSystem === '' || !user) return

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
  }, [votingSystem, players])

  return (
    <>
      {user && (
        <>
          <Header
            username={user.name}
            avatar={user.avatar}
            roomCode={id}
            roomName={title}
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
    </>
  )
}
