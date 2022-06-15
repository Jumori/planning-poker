import React, { Fragment, useState } from 'react'
import { Clock, Copy, Trash } from 'phosphor-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'

import { database, ref, update } from '../../services/firebase'
import { Button } from '../../components/Common/Button'

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
  const navigate = useNavigate()
  const [isShowingDeleteConfirmation, setIsShowingDeleteConfirmation] =
    useState(false)

  const handleSelectBoard = (id: string) => {
    navigate(`/poker-room/${id}`)
  }

  const handleCopyBoardUrl = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url)
      toast.success('Código copiado!')
    }
  }

  const handleDeleteRoom = async (id: string) => {
    await update(ref(database), {
      [`pokerRooms/${id}`]: null
    })

    toast.success('Sala excluída')
    setIsShowingDeleteConfirmation(false)
  }

  return (
    <>
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
            onClick={() => setIsShowingDeleteConfirmation(true)}
          >
            <Trash className="text-red-500" /> Excluir
          </button>
        </div>
      </div>

      <Transition appear show={isShowingDeleteConfirmation} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 flex items-center justify-center"
          onClose={() => setIsShowingDeleteConfirmation(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed flex items-center justify-center inset-0 bg-black/25">
              <Dialog.Panel
                className="
                  w-full
                  max-w-md
                  transform
                  overflow-hidden
                  rounded-2xl
                  bg-white p-6
                  text-left
                  align-middle
                  shadow-xl
                  transition-all"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Excluir sala
                  <span className="mx-1 font-bold">{title}</span>
                </Dialog.Title>

                <div className="my-6">
                  <p>
                    Você está prestes a excluir a sala{' '}
                    <span className="font-bold text-violet-500">{title}</span>.
                    Deseja continuar?
                  </p>
                </div>

                <div className="mt-2 flex gap-4">
                  <Button
                    type="button"
                    color="bg-zinc-500"
                    text-color="text-white"
                    onClick={() => setIsShowingDeleteConfirmation(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    color="bg-red-500"
                    text-color="text-white"
                    onClick={() => handleDeleteRoom(id)}
                  >
                    Excluir sala
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
