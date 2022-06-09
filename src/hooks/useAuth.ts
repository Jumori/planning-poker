import { useContext } from 'react'
import { AuthContext, AuthContextType } from '../context/AuthContext'

export const useAuth = (): AuthContextType => {
  const value = useContext(AuthContext)
  return value
}
