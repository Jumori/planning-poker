import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GoogleLogo } from 'phosphor-react'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useAuth } from '../hooks/useAuth'
import { database, ref, update } from '../services/firebase'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import homeImg from '../assets/undraw_scrum_board_re_wk7v.svg'

type FormData = {
  username: string
  pokerRoomCode: string
}

const schema = Yup.object().shape({
  username: Yup.string().required('Nome obrigatório'),
  pokerRoomCode: Yup.string().required('Código obrigatório')
})

export const Home = () => {
  const navigate = useNavigate()
  const { user, signInWithGoogle, signInAsAnonymous } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleCreateGame = async () => {
    if (user && !user.isAnonymous) {
      navigate(`/dashboard`)
    } else {
      const userStatus = await signInWithGoogle()
      if (userStatus) navigate(`/dashboard`)
    }
  }

  const handleJoinGame = async ({ username, pokerRoomCode }: FormData) => {
    try {
      const userStatus = await signInAsAnonymous(username)
      if (!userStatus) {
        throw new Error('Invalid anonymous user')
      }

      await update(ref(database), {
        [`pokerRooms/${pokerRoomCode}/players/${userStatus.id}`]: {
          name: userStatus.name,
          selectedCard: null
        }
      })

      navigate(`/poker-room/${pokerRoomCode}`)
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
            <Input
              placeholder="Digite seu nome"
              name="username"
              errors={errors.username}
              register={name => register(name)}
            />
            <Input
              placeholder="Digite o código da sala"
              name="pokerRoomCode"
              errors={errors.pokerRoomCode}
              register={name => register(name)}
            />

            <Button type="submit" color="bg-violet-600" text-color="text-white">
              Entrar na Sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
