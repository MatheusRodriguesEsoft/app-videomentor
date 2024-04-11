import User from './user'
import StatusEnum from '@/utils/enumerations/status-enum'
import Subject from './subject'
import Teacher from './teacher'
import ContentMessage from './content-message'
import StatusMessageEnum from '@/utils/enumerations/status-message-enum'
import Student from './student'
import Classe from './class'
/**
 * Modelo de uma menssagem
 *
 * @author Matheus Rodrigues
 */

interface Message {
  idMessage?: string
  contentMessages: ContentMessage[]
  sender: User | Teacher | Student
  receiver: User | Teacher | Student
  subject?: Subject | null
  classe?: Classe | null
  createdDate: Date | number
  statusMessage: StatusMessageEnum
  stMessage: StatusEnum
}
export default Message
