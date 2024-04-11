import StatusMessageEnum from '@/utils/enumerations/status-message-enum'
import Message from './message'
import User from './user'
import StatusContentMessageEnum from '@/utils/enumerations/status-content-message-enum'

/**
 * Modelo de um conteúdo da menssagem
 *
 * @author Matheus Rodrigues
 */

interface ContentMessage {
  idContentMessage?: string
  content: string
  user: User
  date: Date
  message: Message
  statusMessage: StatusContentMessageEnum
}
export default ContentMessage
