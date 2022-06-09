import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaretDown } from 'phosphor-react'

import { useAuth } from '../../hooks/useAuth'
import { HeaderDropdown } from './Dropdown'
import headerImg from '../../assets/undraw_playing_cards_cywn.svg'

interface HeaderProps {
  username: string
  avatar: string
  roomName?: string
  roomCode?: string | undefined
  roomOptions?: { label: string; onClick: () => void }[]
}

export const Header = ({
  username,
  avatar,
  roomName,
  roomCode,
  roomOptions
}: HeaderProps) => {
  const navigate = useNavigate()
  const { user, logOut } = useAuth()
  const [isShowingRoomOptions, setIsShowingRoomOptions] = useState(false)
  const [isShowingUserOptions, setIsShowingUserOptions] = useState(false)
  const [userOptions, setUserOptions] = useState<
    { label: string; onClick: () => void }[]
  >([])

  const handleGoToDashboard = () => {
    navigate(`/dashboard`)
  }

  const handleToggleShowingRoomOptions = () => {
    setIsShowingRoomOptions(!isShowingRoomOptions)
  }

  const handleToggleShowingUserOptions = () => {
    setIsShowingUserOptions(!isShowingUserOptions)
  }

  const handleLogOut = async () => {
    await logOut()
  }

  useEffect(() => {
    const userDropdownOptions = []
    if (!user?.isAnonymous) {
      userDropdownOptions.push({
        label: 'Dashboard',
        onClick: () => handleGoToDashboard()
      })
    }

    userDropdownOptions.push({
      label: 'Sair',
      onClick: () => handleLogOut()
    })

    setUserOptions(userDropdownOptions)
  }, [])

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

              {roomCode && roomOptions && (
                <CaretDown
                  size="15"
                  className={`text-violet-500 transition-all duration-100 ease-linear ${
                    isShowingRoomOptions ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              )}
            </button>
            {roomCode && roomOptions && isShowingRoomOptions && (
              <HeaderDropdown options={roomOptions} />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="
              flex
              items-center
              gap-1
              hover:opacity-75
              transition-all
              duration-150
              ease-linear"
            onClick={handleToggleShowingUserOptions}
          >
            <span className="text-violet-500">{username}</span>

            <CaretDown
              size="15"
              className={`text-violet-500 transition-all duration-100 ease-linear ${
                isShowingUserOptions ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          {isShowingUserOptions && <HeaderDropdown options={userOptions} />}
        </div>

        <img
          src={avatar}
          alt={username}
          className="h-[2.5rem] rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  )
}
