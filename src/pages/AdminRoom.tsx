import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HandPointing } from 'phosphor-react'
import { Header } from '../components/Header/Index'
import { PokerCards } from '../components/PokerCards'

type AdminRoomParams = {
  id: string
}

export const AdminRoom = () => {
  const { id } = useParams<AdminRoomParams>()
  const [votingSystemOptions, setVotingSystemOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelectCard = (value: string) => {
    if (selectedOption !== value) setSelectedOption(value)
    else setSelectedOption(null)
  }

  useEffect(() => {
    setVotingSystemOptions([
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
    ])
  }, [])

  return (
    <>
      <Header username="John Doe" roomName="Meu jogo" roomCode={id} />

      <main className="py-4 px-10">
        <section>
          <p className="flex items-center justify-center gap-1">
            Escolha sua carta <HandPointing size="20" className="rotate-180" />
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
        </section>
      </main>
    </>
  )
}
