/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ChatModal from '@/components/Modal/ChatModal'
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
import { useContext, useEffect, useRef, useState } from 'react'
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const {
    logout,
    setUser,
    openChatModal,
    setOpenChatModal,
    isModalNotificationsOpen,
    setModalNotificationsOpen,
  } = useContext(AuthContext)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const router = useRouter()
  const authApi = new AuthAPI()
  const [isClient, setIsClient] = useState(false)
  const { ['jwt-videomentor']: token } = parseCookies()
  const chatModalRef = useRef<HTMLDivElement>(null)

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

  const handleCloseModalOutside = (event: { target: any }) => {
    if (chatModalRef.current && !chatModalRef.current.contains(event.target && openChatModal)) {
      setOpenChatModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseModalOutside)

    return () => {
      document.removeEventListener('mousedown', handleCloseModalOutside)
    }
  }, [])

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
        {isModalNotificationsOpen && notifications.length > 0 && (
          <NotificationsModal notifications={notifications} />
        )}
        {openChatModal && (
          <div ref={chatModalRef} className={'chat_modal'} id={'chat'}>
            <ChatModal />
          </div>
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
