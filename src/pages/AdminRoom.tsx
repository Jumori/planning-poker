import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HandPointing } from 'phosphor-react'
import { Button } from '../components/Common/Button'
import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/Poker/Cards'
import { PokerTable } from '../components/Poker/Table'

type AdminRoomParams = {
  id: string
}

type PlayersData = {
  id: string
  name: string
  selectedCard: string | null
}

const fibonacciCards = [
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '?'
]

export const AdminRoom = () => {
  const { id } = useParams<AdminRoomParams>()
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
    setVotingSystemOptions(fibonacciCards)

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
  }, [])

  return (
    <>
      <Header username="John Doe" roomName="Meu jogo" roomCode={id} />

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
  )
}
