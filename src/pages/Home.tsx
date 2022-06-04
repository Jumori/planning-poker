import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GoogleLogo } from 'phosphor-react'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button } from '../components/Common/Button'
import homeImg from '../assets/undraw_scrum_board_re_wk7v.svg'

type FormData = {
  gameCode: string
}

const schema = Yup.object().shape({
  gameCode: Yup.string().required('Código obrigatório')
})

export const Home = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleCreateGame = () => {
    try {
      console.log('handleCreateGame')
      toast.success('Login...')
      navigate(`/dashboard`)
    } catch (error) {
      console.log(error)
      toast.error('Credenciais inválidas')
    }
  }

  const handleJoinGame = (data: FormData) => {
    try {
      console.log('handleJoinRoom', data)
      toast.success('Entrando na sala...')
      navigate(`/games/${data.gameCode}`)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível acessar sala')
    }
  }

  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        flex justify-center
        items-stretch
        h-screen
      "
    >
      <aside className="hidden lg:flex flex-col justify-center items-center flex-1 bg-violet-600 p-4 text-white">
        <img
          src={homeImg}
          className="max-w-lg my-6"
          alt="Ilustração com duas pessoas interagindo com um quadro estilo kanban"
        />
        <h1 className="font-bold text-3xl">Crie salas de Planning Poker</h1>
        <p>
          Planeje com seu time atividades com agilidade e de forma descontraída
        </p>
      </aside>

      <main className="flex flex-col justify-center items-center flex-1">
        <div className="flex flex-col justify-center items-center">
          <Button
            color="bg-red-500"
            textColor="text-white"
            type="button"
            onClick={handleCreateGame}
          >
            <GoogleLogo color="white" weight="bold" className="flex w-6 h-6" />
            Crie sua sala com o Google
          </Button>

          <div
            className="
              flex
              items-center
              w-full
              my-6
              text-sm
              text-zinc-500
              before:content-['']
              before:bg-zinc-300
              before:flex-1
              before:h-0.5
              before:mr-4
              after:content-['']
              after:bg-zinc-300
              after:flex-1
              after:h-0.5
              after:ml-4
            "
          >
            ou entre em uma sala
          </div>

          <form
            onSubmit={handleSubmit(data => handleJoinGame(data as FormData))}
            className="flex flex-col"
          >
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Digite o código da sala"
                className={`
                h-12
                w-full
                placeholder-zinc-400
                text-zinc-500
                border-zinc-600
                bg-transparent
                rounded-md
                focus:border-violet-500
                focus:ring-violet-500
                focus:ring-1
                focus:outline-none
                ${errors.gameCode && 'border-red-500 text-red-500'}
              `}
                {...register('gameCode')}
              />
              {errors.gameCode && (
                <span className="text-sm text-red-600">
                  {errors.gameCode.message}
                </span>
              )}
            </div>

            <Button type="submit" color="bg-violet-600" text-color="text-white">
              Entrar na Sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
