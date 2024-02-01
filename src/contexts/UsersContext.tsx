import { createContext, ReactNode, useEffect, useState } from 'react'
import User from '@/models/user'

interface UsersContextData {
  token: string
  user: User
  setUser: any
  users: User[]
  setUsers: any
}
interface UsersProviderProps {
  children: ReactNode
}
export const UsersContex = createContext({} as UsersContextData)

export function UsersProvider({ children }: UsersProviderProps) {
  const [token, setToken] = useState<any>('')
  const [user, setUser] = useState<any>(true)
  const [users, setUsers] = useState<User[]>([])

  return (
    <UsersContex.Provider
      value={{
        token,
        user,
        setUser,
        users,
        setUsers,
      }}
    >
      {children}
    </UsersContex.Provider>
  )
}
