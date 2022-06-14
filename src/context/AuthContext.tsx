import React, { createContext, ReactNode, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  updateProfile
} from '../services/firebase'
import userImg from '../assets/user.svg'

type User = {
  id: string
  name: string
  avatar: string
  isAnonymous: boolean
}

export type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<User | null>
  signInAsAnonymous: (username: string) => Promise<User | null>
  logOut: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState<User | undefined>(undefined)

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)

      if (!result.user) return null

      const { displayName, photoURL, uid, isAnonymous } = result.user

      if (!displayName) {
        throw new Error('Missing account information.')
      }

      const userData = {
        id: uid,
        name: displayName,
        avatar: photoURL || userImg,
        isAnonymous
      }

      setUser(userData)

      return userData
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const signInAsAnonymous = async (username: string) => {
    try {
      const result = await signInAnonymously(auth)
      if (!result.user) {
        throw new Error('Invalid user')
      }

      await updateProfile(result.user, {
        displayName: username
      })

      const updatedUser = auth.currentUser

      if (!updatedUser) {
        throw new Error('Invalid user')
      }

      if (!updatedUser.displayName) {
        throw new Error('Missing account information.')
      }

      const userData = {
        id: updatedUser.uid,
        name: updatedUser.displayName,
        avatar: userImg,
        isAnonymous: updatedUser.isAnonymous
      }

      setUser(userData)

      return userData
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      setUser(undefined)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      try {
        if (user) {
          const { displayName, photoURL, uid, isAnonymous } = user

          if (!displayName && !isAnonymous) {
            throw new Error('Missing account information.')
          }

          setUser({
            id: uid,
            name: displayName || '',
            avatar: photoURL || userImg,
            isAnonymous
          })
        } else {
          if (
            location.pathname !== '/' &&
            !location.pathname.includes('/poker-room/')
          ) {
            toast.error('Sessão expirada')
            navigate('/')
          }
        }
      } catch (error) {
        console.log(error)
        toast.error(
          'Ops! Parece que sua conta não possui nome de apresentação e/ou foto'
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signInAsAnonymous, logOut }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
