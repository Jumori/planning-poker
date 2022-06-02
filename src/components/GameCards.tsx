import React from 'react'
import { Clock, Copy, Trash } from 'phosphor-react'

interface GameCardsProps {
  id: string
  title: string
  date: string
  rounds: number
  scoresHeight: string[]
  url: string
}

export const GameCards = ({
  id,
  title,
  date,
  rounds,
  scoresHeight,
  url
}: GameCardsProps) => {
  const handleSelectBoard = (id: string) => {
    console.log('handleSelectBoard', id)
  }

  const handleCopyBoardUrl = (url: string) => {
    console.log('handleCopyBoardUrl', url)
  }

  const handleDeleteBoard = (id: string) => {
    console.log('handleDeleteBoard', id)
  }

  return (
    <div className="bg-zinc-200 rounded-lg flex flex-col justify-between max-h-[16.25rem]">
      <button
        className="flex flex-col justify-between items-center hover:opacity-75 transition-all duration-150 ease-linear"
        type="button"
        onClick={() => handleSelectBoard(id)}
      >
        <div className="py-2 px-6 w-full">
          <p>{title}</p>

          <div className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1 text-sm">
              <Clock className="text-violet-500" /> {date}
            </span>
            <span className="text-sm">
              {`${rounds > 1 ? `${rounds} rodadas` : `${rounds} rodada`}`}
            </span>
          </div>
        </div>
        <div className="border-y-[0.1rem] border-solid border-violet-500 py-2 px-3 flex items-end gap-1 h-[10rem]">
          {scoresHeight.map((scoreHeight, index) => {
            return (
              <div
                key={index}
                className={`rounded-sm bg-zinc-300 w-5 max-h-full ${scoreHeight}`}
              ></div>
            )
          })}
        </div>
      </button>
      <div className="py-2 px-6 flex justify-between gap-6">
        <button
          className="flex items-center gap-1 text-sm hover:opacity-75 transition-all duration-150 ease-linear"
          type="button"
          onClick={() => handleCopyBoardUrl(url)}
        >
          <Copy className="text-violet-500" /> Copiar link
        </button>
        <button
          className="flex items-center gap-1 text-sm hover:opacity-75 transition-all duration-150 ease-linear"
          type="button"
          onClick={() => handleDeleteBoard(id)}
        >
          <Trash className="text-red-500" /> Excluir
        </button>
      </div>
    </div>
  )
}
