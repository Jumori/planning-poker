import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'phosphor-react'

import headerImg from '../assets/undraw_playing_cards_cywn.svg'

interface HeaderProps {
  username: string
}

export const Header = ({ username }: HeaderProps) => {
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    navigate(`/dashboard`)
  }

  return (
    <header
      className="
        h-[5.625rem]
        bg-zinc-200
        shadow-md
        flex
        items-center
        justify-between
        px-10
        py-4"
    >
      <img
        src={headerImg}
        alt="Duas cartas de baralho, sendo a carta da esquerda uma rainha copas e a carta da direita um rei de ouro"
        className="h-[4.3rem]"
      />

      <div className="flex items-center gap-4">
        <span className="text-violet-500">{username}</span>
        <button
          type="button"
          className="
          bg-zinc-300
          rounded-full
          p-2
          hover:opacity-75
          transition-all
          duration-150
          ease-linear"
          onClick={handleGoToDashboard}
        >
          <User size="2.5rem" weight="regular" className="text-violet-500" />
        </button>
      </div>
    </header>
  )
}
