import React from 'react'

interface PokerCardsProps {
  label: string
  isActive: boolean
  selectCard: () => void
}

export const PokerCards = ({
  label,
  isActive,
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
        flex
        items-center
        justify-center
        hover:bg-violet-500
        hover:text-zinc-100
        hover:-translate-y-4
        transition-all
        duration-150
        ease-linear
        ${
          isActive
            ? 'border-violet-500 bg-violet-500 text-zinc-100'
            : 'border-violet-500 text-violet-500'
        }
        `}
      onClick={selectCard}
    >
      <span>{label}</span>
    </button>
  )
}
