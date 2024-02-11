import User from '@/models/user'
import { createContext, ReactNode, useState } from 'react'

interface UsersContextData {
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
  const [user, setUser] = useState<any>(true)
  const [users, setUsers] = useState<User[]>([])

  return (
    <UsersContex.Provider
      value={{
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
