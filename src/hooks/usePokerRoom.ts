import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { database, ref, onValue } from '../services/firebase'
import toast from 'react-hot-toast'

export const votingSystems = {
  fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']
}

type PlayerData = {
  id: string
  name: string
  selectedCard: string | null
}

export type UsePokerRoomType = {
  owner: string | null
  title: string
  votingSystem: keyof typeof votingSystems | ''
  players: PlayerData[]
  isShowingCards: boolean
}

export const usePokerRoom = (pokerRoomId?: string): UsePokerRoomType => {
  const navigate = useNavigate()

  const [owner, setOwner] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [votingSystem, setVotingSystem] = useState<
    keyof typeof votingSystems | ''
  >('')
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [isShowingCards, setIsShowingCards] = useState(false)

  useEffect(() => {
    if (pokerRoomId) {
      const pokerRoomRef = ref(database, `pokerRooms/${pokerRoomId}`)
      const unsubscribe = onValue(pokerRoomRef, room => {
        const databaseRoom = room.val()

        if (!databaseRoom) {
          toast.error('Sala indisponível')
          navigate('/')
          return
        }

        const databaseRoomPlayers = databaseRoom.players as {
          [key: string]: {
            name: string
            selectedCard: string | null
          }
        }

        if (databaseRoomPlayers) {
          const parsedPlayers = Object.entries(databaseRoomPlayers).map(
            ([playerId, playerName]: [
              string,
              { name: string; selectedCard: string | null }
            ]) => ({
              id: playerId,
              name: playerName.name,
              selectedCard: playerName.selectedCard
            })
          )

          setPlayers(parsedPlayers)
        }

        setOwner(databaseRoom.ownerId)
        setTitle(databaseRoom.title)
        setVotingSystem(databaseRoom.votingSystem)
        setIsShowingCards(Boolean(databaseRoom.showingCards))
      })

      return () => {
        unsubscribe()
      }
    }
  }, [pokerRoomId])

  return { title, votingSystem, players, owner, isShowingCards }
}
