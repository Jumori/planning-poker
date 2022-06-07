import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HandPointing } from 'phosphor-react'
import toast from 'react-hot-toast'

import { useAuth } from '../hooks/useAuth'
import { usePokerRoom, votingSystems } from '../hooks/usePokerRoom'
import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/Poker/Cards'
import { PokerTable } from '../components/Poker/Table'

type PokerRoomParams = {
  id: string
}

type PlayersData = {
  id: string
  name: string
  selectedCard: string | null
}

export const PokerRoom = () => {
  const { id } = useParams<PokerRoomParams>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { title, votingSystem } = usePokerRoom(id)

  const [votingSystemOptions, setVotingSystemOptions] = useState<string[]>([])
  const [players, setPlayers] = useState<PlayersData[][]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isShowingCards, setIsShowingCards] = useState(false)

  const handleSelectCard = (value: string) => {
    if (isShowingCards) return

    if (selectedOption !== value) setSelectedOption(value)
    else setSelectedOption(null)
  }

  const handleShowCards = () => {
    if (selectedOption) {
      setIsShowingCards(!isShowingCards)
    }
  }

  useEffect(() => {
    if (votingSystem === '') return

    setVotingSystemOptions(votingSystems[votingSystem])

    const roomPlayers: PlayersData[] = [
      {
        id: '2',
        name: 'John Doe',
        selectedCard: null
      },
      {
        id: '3',
        name: 'John Trois',
        selectedCard: null
      },
      {
        id: '4',
        name: 'John Quatre',
        selectedCard: null
      },
      {
        id: '5',
        name: 'John Cinq',
        selectedCard: null
      },
      {
        id: '6',
        name: 'John Six',
        selectedCard: null
      },
      {
        id: '7',
        name: 'John Sept',
        selectedCard: null
      },
      {
        id: '8',
        name: 'John Huit',
        selectedCard: null
      },
      {
        id: '9',
        name: 'John Neuf',
        selectedCard: null
      },
      {
        id: '10',
        name: 'John Dix',
        selectedCard: null
      }
    ]

    const parsedPlayers = roomPlayers.reduce(
      (playersByCategory, player, idx) => {
        playersByCategory[idx % 4].push(player)
        return [...playersByCategory]
      },
      [[], [], [], []] as PlayersData[][]
    )

    setPlayers(parsedPlayers)
  }, [votingSystem])

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
                  players={players}
                  isShowingCards={isShowingCards}
                  isShowingToggleButton={!!selectedOption}
                  handleShowCards={() => handleShowCards}
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