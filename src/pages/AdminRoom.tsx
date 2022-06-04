import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HandPointing } from 'phosphor-react'
import { Button } from '../components/Common/Button'
import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/PokerCards'

type AdminRoomParams = {
  id: string
}

type PlayersData = {
  id: string
  name: string
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
        name: 'John Doe'
      },
      {
        id: '3',
        name: 'John Trois'
      },
      {
        id: '4',
        name: 'John Quatre'
      },
      {
        id: '5',
        name: 'John Cinq'
      },
      {
        id: '6',
        name: 'John Six'
      },
      {
        id: '7',
        name: 'John Sept'
      },
      {
        id: '8',
        name: 'John Huit'
      },
      {
        id: '9',
        name: 'John Neuf'
      },
      {
        id: '10',
        name: 'John Dix'
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
            <div className="w-[75%] grid grid-rows-3 grid-flow-col gap-8">
              <div></div>

              {/* Left */}
              <div className="flex flex-col items-end justify-center">
                <div className="flex flex-col">
                  {players[2].map(player => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center justify-center"
                    >
                      <span className="text-sm">{player.name}</span>
                      <PokerCards
                        label={selectedOption || ''}
                        isActive={!!selectedOption}
                        isShowingValue={isShowingCards}
                        isClickable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div></div>

              {/* Top */}
              <div className="flex items-end justify-center">
                <div className="flex">
                  {players[1].map(player => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center justify-center"
                    >
                      <span className="text-sm">{player.name}</span>
                      <PokerCards
                        label={selectedOption || ''}
                        isActive={!!selectedOption}
                        isShowingValue={isShowingCards}
                        isClickable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-[10rem] w-full bg-zinc-200 rounded-md flex items-center justify-center">
                {selectedOption ? (
                  <div>
                    <Button onClick={handleShowCards}>Virar as cartas</Button>
                  </div>
                ) : (
                  <div>
                    <span className="text-violet-500">Escolha sua carta!</span>
                  </div>
                )}
              </div>

              {/* Bottom */}
              <div className="flex items-start justify-center">
                <div className="flex">
                  {players[0].map(player => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center justify-center"
                    >
                      <span className="text-sm">{player.name}</span>
                      <PokerCards
                        label={selectedOption || ''}
                        isActive={!!selectedOption}
                        isShowingValue={isShowingCards}
                        isClickable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div></div>

              {/* Right */}
              <div className="flex flex-col items-start justify-start gap-2">
                <div className="flex flex-col">
                  {players[3].map(player => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center justify-center"
                    >
                      <span className="text-sm">{player.name}</span>
                      <PokerCards
                        label={selectedOption || ''}
                        isActive={!!selectedOption}
                        isShowingValue={isShowingCards}
                        isClickable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div></div>
            </div>
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
