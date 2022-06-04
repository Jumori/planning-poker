import React from 'react'

interface PokerCardsProps {
  label: string
  isActive: boolean
  isShowingValue?: boolean
  isClickable?: boolean
  selectCard?: () => void
}

export const PokerCards = ({
  label,
  isActive,
  isShowingValue = true,
  isClickable = true,
  selectCard
}: PokerCardsProps) => {
  return (
    <button
      className={`
        border-2
        py-4
        px-4
        rounded-md
        w-4
        h-16
        flex
        items-center
        justify-center
        transition-all
        duration-150
        ease-linear
        ${
          isActive && isClickable
            ? 'border-violet-500 bg-violet-500 text-zinc-100'
            : !isActive && isClickable
            ? 'border-violet-500 text-violet-500'
            : isActive && !isClickable && !isShowingValue
            ? 'border-violet-300 bg-violet-300'
            : isActive && !isClickable && isShowingValue
            ? 'border-violet-500 text-violet-500 rotate-y-180 preserve-3d'
            : 'border-zinc-200 bg-zinc-200 text-zinc-300'
        }
        ${
          isClickable
            ? 'hover:bg-violet-500 hover:text-zinc-100 hover:-translate-y-4'
            : 'cursor-default'
        }
      `}
      onClick={selectCard}
    >
      <span
        className={`${
          isActive && !isClickable && isShowingValue ? 'rotate-y-180' : ''
        }`}
      >
        {isShowingValue ? label : ''}
      </span>
    </button>
  )
}
