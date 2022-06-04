import React from 'react'

import { Button } from '../Common/Button'
import { PokerCards } from './Cards'

type PlayersData = {
  id: string
  name: string
  selectedCard: string | null
}

interface PokerTableProps {
  players: PlayersData[][]
  isShowingCards: boolean
  isShowingToggleButton: boolean
  handleShowCards: () => void
}

export const PokerTable = ({
  players,
  isShowingCards,
  isShowingToggleButton,
  handleShowCards
}: PokerTableProps) => {
  return (
    <>
      {players.length === 4 && (
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
                    label={player.selectedCard || ''}
                    isActive={!!player.selectedCard}
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
                    label={player.selectedCard || ''}
                    isActive={!!player.selectedCard}
                    isShowingValue={isShowingCards}
                    isClickable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center table */}
          <div className="min-h-[10rem] w-full bg-zinc-200 rounded-md flex items-center justify-center">
            {isShowingToggleButton ? (
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
                    label={player.selectedCard || ''}
                    isActive={!!player.selectedCard}
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
                    label={player.selectedCard || ''}
                    isActive={!!player.selectedCard}
                    isShowingValue={isShowingCards}
                    isClickable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>
      )}
    </>
  )
}
