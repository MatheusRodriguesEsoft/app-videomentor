/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { AuthContext } from '@/contexts/AuthContext'
import Notification from '@/models/notification'
import { useRouter } from 'next/navigation'
import {
  CSSProperties,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GoGear } from 'react-icons/go'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoLogOutOutline, IoMailOutline } from 'react-icons/io5'
import { RiMenuFoldLine, RiMenuLine } from 'react-icons/ri'
import Swal from 'sweetalert2'
import styles from './styles/TopBar.module.css'
import RoleEnum from '@/utils/enumerations/role-enum'
import MessageAPI from '@/resources/api/message'
import Message from '@/models/message'
import StatusMessageEnum from '@/utils/enumerations/status-message-enum'
import StatusContentMessageEnum from '@/utils/enumerations/status-content-message-enum'
import ContentMessage from '@/models/content-message'
import ContentMessageAPI from '@/resources/api/content-message'

interface TopBarProps {
  stylesProps: CSSProperties | undefined
  notifications: Notification[]
  isSidebarOpen: boolean
  specificElementRef: RefObject<HTMLDivElement>
  toggleSidebar: () => void
  logout: () => void
}

export function TopBar({
  isSidebarOpen,
  notifications,
  toggleSidebar,
  specificElementRef,
  logout,
}: TopBarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [amountNewMessages, setAmountNewMessages] = useState<number>(0)
  const router = useRouter()
  const messageApi = new MessageAPI()
  const contentMessageApi = new ContentMessageAPI()
  const {
    user,
    setModalNotificationsOpen,
    isModalNotificationsOpen,
    setContent,
    openChatModal,
    setContentChat,
    setOpenChatModal,
  } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      messageApi
        .findAllByIdReceiver(user.idUser as string)
        .then((res) => setMessages(res.data as Message[]))
    }
  }, [user])

  const contentMessages = messages.flatMap((message) => message.contentMessages)

  const updateContentMessage = (contentMessage: ContentMessage) => {
    contentMessageApi
      .update(contentMessage)
      .then((res) => console.log(res.data))
  }

  useEffect(() => {
    const newMessagesCount = contentMessages.reduce((count, contentMessage) => {
      if (contentMessage.user.idUser !== user?.idUser) {
        if (contentMessage.statusMessage === StatusContentMessageEnum.SENT) {
          updateContentMessage({
            ...contentMessage,
            statusMessage: StatusContentMessageEnum.RECEIVED,
          })
        }
        if (contentMessage.statusMessage !== StatusContentMessageEnum.VIEWED) {
          return count + 1
        }
      }
      return count
    }, 0)

    setAmountNewMessages(newMessagesCount)
  }, [contentMessages, user])

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
          ref={specificElementRef}
          onClick={() => {
            setContentChat('historicMessage')
            setOpenChatModal(!openChatModal)
          }}
        >
          <IoMailOutline size={28} />
          {amountNewMessages > 0 && (
            <span className={styles.amountNotifications}>
              {amountNewMessages}
            </span>
          )}
        </div>

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
        <div>
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
        </div>
        <div>
          <IoLogOutOutline size={28} onClick={logout} />
        </div>
      </div>
    </div>
  )
}
