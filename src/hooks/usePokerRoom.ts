import { useEffect, useState } from 'react'
import { database, ref, onValue } from '../services/firebase'

export const votingSystems = {
  fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']
}

export type UsePokerRoomType = {
  title: string
  votingSystem: keyof typeof votingSystems | ''
}

export const usePokerRoom = (pokerRoomId?: string): UsePokerRoomType => {
  const [title, setTitle] = useState('')
  const [votingSystem, setVotingSystem] = useState<
    keyof typeof votingSystems | ''
  >('')

  useEffect(() => {
    const pokerRoomRef = ref(database, `pokerRooms/${pokerRoomId}`)
    onValue(pokerRoomRef, room => {
      const databaseRoom = room.val()

      setTitle(databaseRoom.title)
      setVotingSystem(databaseRoom.votingSystem)
    })
  }, [])

  return { title, votingSystem }
}
