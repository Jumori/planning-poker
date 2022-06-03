import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, CaretDown } from 'phosphor-react'
import toast from 'react-hot-toast'

import { HeaderDropdown } from './Dropdown'
import headerImg from '../../assets/undraw_playing_cards_cywn.svg'

interface HeaderProps {
  username: string
  roomName?: string
  roomCode?: string | undefined
}

export const Header = ({ username, roomName, roomCode }: HeaderProps) => {
  const navigate = useNavigate()
  const [isShowingRoomOptions, setIsShowingRoomOptions] = useState(false)

  const handleGoToDashboard = () => {
    navigate(`/dashboard`)
  }

  const handleToggleShowingRoomOptions = () => {
    setIsShowingRoomOptions(!isShowingRoomOptions)
  }

  const handleCopyRoomCodeToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
      toast('Código copiado!')
    }
  }

  const handleFinishRoom = () => {
    console.log('handleFinishRoom')
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
      <div className="flex justify-center items-center gap-2">
        <img
          src={headerImg}
          alt="Duas cartas de baralho, sendo a carta da esquerda uma rainha copas e a carta da direita um rei de ouro"
          className="h-[4.3rem]"
        />

        {roomName && (
          <div className="relative">
            <button
              type="button"
              className="
              flex
              items-center
              gap-1
              hover:opacity-75
              transition-all
              duration-150
              ease-linear"
              onClick={handleToggleShowingRoomOptions}
            >
              <span className="text-lg text-violet-500 font-bold">
                {roomName}
              </span>

              {roomCode && (
                <CaretDown
                  size="15"
                  className={`text-violet-500 transition-all duration-100 ease-linear ${
                    isShowingRoomOptions ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              )}
            </button>
            {roomCode && isShowingRoomOptions && (
              <HeaderDropdown
                options={[
                  {
                    label: 'Copiar link',
                    onClick: () => handleCopyRoomCodeToClipboard()
                  },
                  { label: 'Encerrar sala', onClick: () => handleFinishRoom() }
                ]}
              />
            )}
          </div>
        )}
      </div>

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