/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Auth from '@/models/auth'
import User from '@/models/user'
import AuthAPI from '@/resources/api/auth'
import { useRouter } from 'next/navigation'
import { destroyCookie, setCookie } from 'nookies'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'
import Swal from 'sweetalert2'

interface AuthContextData {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  signIn: (data: Auth) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  isAuthenticated: boolean
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  isModalNotificationsOpen: boolean
  setModalNotificationsOpen: Dispatch<SetStateAction<boolean>>
  renderAvatar: number
  setRenderAvatar: Dispatch<SetStateAction<number>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

interface AuthProviderProps {
  children: ReactNode
}
export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isModalNotificationsOpen, setModalNotificationsOpen] =
    useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [content, setContent] = useState<string>('formLogin')
  const [renderAvatar, setRenderAvatar] = useState<number>(Math.random())
  const isAuthenticated = !!user
  const router = useRouter()
  const authApi = new AuthAPI()

  async function signIn({ username, password }: Auth) {
    authApi
      .signIn({ username, password })
      .then((res) => {
        Swal.fire({
          title: 'Carregando...',
        })
        Swal.showLoading()
        setUser(res.data.user as User)
        setCookie(undefined, 'jwt-videomentor', res.data.token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        router.push('/dashboard')
      })
      .catch((e) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          title: 'Ocorreu um erro',
          text: `${e.response.data.message}`,
          icon: 'error',
        })
      })
      .finally()
  }

  async function logout() {
    Swal.fire({
      title: 'Carregando...',
    })
    Swal.showLoading()
    destroyCookie({}, 'jwt-videomentor')
    setTimeout(() => {
      router.push('/')
      Swal.close()
    }, 500)
  }

  async function forgotPassword(email: string) {
    authApi
      .forgotPassword(email)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          title: 'Solicitação enviada com sucesso!',
          text: 'Entre em contato com seu administrador para obter uma senha provisória.',
          icon: 'success',
        }).then(() => setContent('formLogin'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          title: 'Ocorreu um erro',
          text: err.response.data.message,
          icon: 'error',
        })
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        logout,
        forgotPassword,
        content,
        setContent,
        isAuthenticated,
        isModalOpen,
        setIsModalOpen,
        renderAvatar,
        setRenderAvatar,
        isModalNotificationsOpen,
        setModalNotificationsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
