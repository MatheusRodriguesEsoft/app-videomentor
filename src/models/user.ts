import StatusPassword from '@/utils/enumerations/status-password'
import StatusEnum from '@/utils/enumerations/status-enum'
import Notification from './notification'

/**
 * Modelo de um usuário
 *
 * @author Matheus Rodrigues
 */

export interface Role {
  idRole?: string
  nmRole: string
  stRole: StatusEnum
}

interface User {
  idUser?: string
  nmUser: string
  username: string
  password: string
  image: string
  temporaryPassword: string
  roles: Role[]
  notifications?: Notification[]
  stPassword: StatusPassword
  stUser: StatusEnum
}
export default User
