import AppNotification from '../Notification/Notifications'
import styles from './styles/NotificationsModal.module.css'
import Notification from '@/models/notification'

interface NotificationsModalProps {
  notifications: Notification[]
}

export function NotificationsModal({ notifications }: NotificationsModalProps) {
  return (
    <div className={`${styles.container} centered`}>
      {notifications.map((n) => (
        <AppNotification key={n.idNotification} notification={n} />
      ))}
    </div>
  )
}
