import { UsersContex } from './UsersContext'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

interface DataContextProps {}
interface DataProviderProps {
  children: ReactNode
}
export const DataContex = createContext({} as DataContextProps)

export function DataProvider({ children }: DataProviderProps) {
  const { user } = useContext(UsersContex)
  const [token, setToken] = useState<any>(null)

  return <DataContex.Provider value={{}}>{children}</DataContex.Provider>
}
