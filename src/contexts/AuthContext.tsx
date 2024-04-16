/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Auth from '@/models/auth'
import Student from '@/models/student'
import Teacher from '@/models/teacher'
import User from '@/models/user'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { useRouter } from 'next/navigation'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'
import Swal from 'sweetalert2'

interface AuthContextData {
  user: User | Student | Teacher | null
  setUser: Dispatch<SetStateAction<User | null>>
  signIn: (data: Auth) => Promise<void>
  signInTeacher: (data: Auth) => Promise<void>
  signInStudent: (data: Auth) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  isAuthenticated: boolean
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  token: string | null
  setToken: Dispatch<SetStateAction<string | null>>
  isModalNotificationsOpen: boolean
  setModalNotificationsOpen: Dispatch<SetStateAction<boolean>>
  renderAvatar: number
  setRenderAvatar: Dispatch<SetStateAction<number>>
  content: string
  setContent: Dispatch<SetStateAction<string>>
  contentChat: string
  setContentChat: Dispatch<SetStateAction<string>>
  openChatModal: boolean
  setOpenChatModal: Dispatch<SetStateAction<boolean>>
}

interface AuthProviderProps {
  children: ReactNode
}
export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const { ['jwt-videomentor']: dataToken } = parseCookies()
  const [token, setToken] = useState<string | null>(null)
  const [isModalNotificationsOpen, setModalNotificationsOpen] =
    useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [content, setContent] = useState<string>('formLogin')
  const [contentChat, setContentChat] = useState<string>('newMessage')
  const [openChatModal, setOpenChatModal] = useState<boolean>(false)
  const [renderAvatar, setRenderAvatar] = useState<number>(Math.random())
  const isAuthenticated = !!user
  const router = useRouter()
  const authApi = new AuthAPI()

  useEffect(() => {
    setToken(dataToken)
  }, [dataToken])

  const handleToken = (
    res: { data: { user: User; token: string } },
    route: string
  ) => {
    Swal.fire({
      title: 'Carregando...',
    })
    Swal.showLoading()
    setUser(res.data.user as User)
    setCookie(undefined, 'jwt-videomentor', res.data.token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    router.push(route)
  }

  const getError = (e: { response: { data: { message: string } } }) => {
    Swal.fire({
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Ok',
      title: 'Ocorreu um erro',
      text: `${e.response.data.message}`,
      icon: 'error',
    })
  }

  async function signIn({ username, password }: Auth) {
    authApi
      .signIn({ username, password })
      .then((res: any) => {
        if (user?.roles.some((role) => role.nmRole === RoleEnum.ADMIM)) {
          handleToken(res, '/dashboard')
        }
      })
      .catch((e) => getError(e))
      .finally()
  }

  async function signInTeacher({ username, password }: Auth) {
    authApi
      .signInTeacher({ username, password })
      .then((res: any) => {
        if (user?.roles.some((role) => role.nmRole === RoleEnum.TEACHER)) {
          handleToken(res, '/professor/home')
        }
        if (user?.roles.some((role) => role.nmRole === RoleEnum.ADMIM)) {
          handleToken(res, '/dashboard')
        }
      })
      .catch((e) => getError(e))
      .finally()
  }

  async function signInStudent({ username, password }: Auth) {
    authApi
      .signInStudent({ username, password })
      .then((res: any) => {
        if (user?.roles.some((role) => role.nmRole === RoleEnum.TEACHER)) {
          handleToken(res, '/aluno/home')
        }
        if (user?.roles.some((role) => role.nmRole === RoleEnum.ADMIM)) {
          handleToken(res, '/dashboard')
        }
      })
      .catch((e) => getError(e))
      .finally()
  }

  async function logout() {
    Swal.fire({
      title: 'Carregando...',
    })
    Swal.showLoading()
    destroyCookie({}, 'jwt-videomentor')
    setToken(null)
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
        token,
        setToken,
        signIn,
        signInTeacher,
        signInStudent,
        logout,
        forgotPassword,
        content,
        setContent,
        isAuthenticated,
        isModalOpen,
        setIsModalOpen,
        renderAvatar,
        setRenderAvatar,
        contentChat,
        setContentChat,
        openChatModal,
        setOpenChatModal,
        isModalNotificationsOpen,
        setModalNotificationsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
