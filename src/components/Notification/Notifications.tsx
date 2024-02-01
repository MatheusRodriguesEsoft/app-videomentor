import Notification from '@/models/notification'
import styles from './styles/Notification.module.css'
import React from 'react'
import { actionsNotifications } from '@/utils/notifications/actions'

interface AppNotificationProps {
  notification: Notification
}

const AppNotification = ({ notification }: AppNotificationProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title} style={{ marginBottom: '1rem' }}>
          {notification.nmNotification}
        </span>
      </div>
      <div className={styles.bodyContainer}>
        <span className={styles.body}>{notification.message}</span>
      </div>

      {actionsNotifications && (
        <div className={styles.actionsContainer}>
          {React.createElement(actionsNotifications[notification.actions])}
        </div>
      )}
    </div>
  )
}
export default AppNotification
