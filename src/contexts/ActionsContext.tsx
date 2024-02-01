/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { usePathname, useRouter } from 'next/navigation'
import appRoutes from '@/routes/appRoutes'
import { parseCookies, setCookie } from 'nookies'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ActionsContextData {
  token: string
  toggleSidebar: () => void
  isSidebarOpen: boolean
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
  contentModal: string
  setContentModal: Dispatch<SetStateAction<string>>
  isClient: boolean
  setIsClient: Dispatch<SetStateAction<boolean>>
}

interface ActionsProviderProps {
  children: ReactNode
}
export const ActionsContext = createContext({} as ActionsContextData)

export function ActionsProvider({ children }: ActionsProviderProps) {
  const [contentModal, setContentModal] = useState<string>('studentForm')
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { ['jwt-videomentor']: token } = parseCookies()
  const { ['ctn-videomentor']: contentPage } = parseCookies()
  const [content, setContent] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const isInitialMount = useRef(true)

  const pathname = usePathname()

  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.replace('/')
    }

    setIsClient(true)
  }, [token])

  useEffect(() => {
    if (content) setCookie(undefined, 'ctn-videomentor', content, {})
  }, [content])

  useEffect(() => {
    if (!isInitialMount.current) {
      setContent(contentPage)
    } else {
      isInitialMount.current = false
    }
  }, [])

  return (
    <ActionsContext.Provider
      value={{
        token,
        toggleSidebar,
        isSidebarOpen,
        setIsSidebarOpen,
        openModal,
        setOpenModal,
        content,
        setContent,
        contentModal,
        setContentModal,
        isClient,
        setIsClient,
      }}
    >
      {children}
    </ActionsContext.Provider>
  )
}
