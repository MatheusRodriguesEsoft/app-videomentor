'use client'
import { AuthContext } from '@/contexts/AuthContext'
import Notification from '@/models/notification'
import { useRouter } from 'next/navigation'
import { CSSProperties, useContext } from 'react'
import { GoGear } from 'react-icons/go'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoLogOutOutline } from 'react-icons/io5'
import { RiMenuFoldLine, RiMenuLine } from 'react-icons/ri'
import Swal from 'sweetalert2'
import styles from './styles/TopBar.module.css'

interface TopBarProps {
  stylesProps: CSSProperties | undefined
  notifications: Notification[]
  isSidebarOpen: boolean
  toggleSidebar: () => void
  logout: () => void
}

export function TopBar({
  isSidebarOpen,
  notifications,
  toggleSidebar,
  logout,
}: TopBarProps) {
  const { setModalNotificationsOpen, isModalNotificationsOpen, setContent } =
    useContext(AuthContext)
  const router = useRouter()

  return (
    <div className={`${styles.container} centered`}>
      <div className={styles.mainContant}>
        {!isSidebarOpen ? (
          <RiMenuLine
            size={30}
            className={styles.mdOutlineMenu}
            onClick={toggleSidebar}
          />
        ) : (
          <RiMenuFoldLine
            size={33}
            className={styles.mdOutlineMenuOpen}
            onClick={toggleSidebar}
          />
        )}
      </div>
      <div className={styles.actions}>
        <div
          className={styles.notificationsContainer}
          onClick={() => setModalNotificationsOpen(!isModalNotificationsOpen)}
        >
          <IoMdNotificationsOutline size={28} />
          {notifications && notifications?.length > 0 && (
            <span className={styles.amountNotifications}>
              {notifications.length}
            </span>
          )}
        </div>
        <GoGear
          size={27}
          onClick={() => {
            setContent('update')
            Swal.fire({
              title: 'Carregando...',
            })
            Swal.showLoading()

            router.push('/config/profile')
          }}
        />
        <IoLogOutOutline size={28} onClick={logout} />
      </div>
    </div>
  )
}
