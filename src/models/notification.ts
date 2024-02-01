import StatusEnum from '@/utils/enumerations/status-enum'

/**
 * Modelo de uma notificação
 *
 */

interface Notification {
  idNotification?: string
  nmNotification: string
  message: string
  actions: number
  stNotification: StatusEnum
}

export default Notification
