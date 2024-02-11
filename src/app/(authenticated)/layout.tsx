/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { NotificationsModal } from '@/components/Modal/NotificationsModal'
import Sidebar from '@/components/SideBar/SideBar'
import { TopBar } from '@/components/TopBar/TopBar'
import { AuthContext } from '@/contexts/AuthContext'
import Notification from '@/models/notification'
import User from '@/models/user'
import { PrivateProviders } from '@/providers/PrivateProviders'
import AuthAPI from '@/resources/api/auth'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const {
    logout,
    user,
    setUser,
    isModalOpen,
    setIsModalOpen,
    isModalNotificationsOpen,
    setModalNotificationsOpen,
  } = useContext(AuthContext)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [idUser, setIdUser] = useState<string>('')
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const router = useRouter()
  const authApi = new AuthAPI()
  const [isClient, setIsClient] = useState(false)
  const { ['jwt-videomentor']: token } = parseCookies()

  useEffect(() => {
    if (!token) {
      router.replace('/')
      return
    }
    authApi
      .findUserByToken(token)
      .then((res) => setUser(res.data as User))
      .catch((err) => console.log(err))
    setIsClient(true)
  }, [token])

  if (!token) {
    return null
  }

  return isClient ? (
    <PrivateProviders>
      <div className={'centered layout'}>
        <TopBar
          stylesProps={{
            paddingLeft: isSidebarOpen ? '0px' : '80px',
            transition: 'all .5s',
          }}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          notifications={notifications}
          logout={logout}
        />
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* {isModalOpen && (
          <ModalRedefinePassword
            setIsModalOpen={setIsModalOpen}
            idUser={idUser}
          />
        )} */}
        {isModalNotificationsOpen && notifications.length > 0 && (
          <NotificationsModal notifications={notifications} />
        )}
        <div
          onClick={() => setModalNotificationsOpen(false)}
          className={'children'}
          style={{
            paddingLeft: isSidebarOpen
              ? 'calc(245px + 2rem)'
              : 'calc(80px + 2rem)',
          }}
        >
          {children}
        </div>
      </div>
    </PrivateProviders>
  ) : null
}
