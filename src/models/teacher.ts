import StatusEnum from '@/utils/enumerations/status-enum'
import Notification from './notification'
import User from './user'
import Student from './student'
import Subject from './subject'
/**
 * Modelo de um professor
 *
 * @author Matheus Rodrigues
 */

interface Teacher extends User {
  subjects: Subject[]
}
export default Teacher
