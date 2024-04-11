import StatusEnum from '@/utils/enumerations/status-enum'
import User from './user'
import VideoAula from './video-aula'

/**
 * Modelo de um comentário
 *
 */

interface Comment {
  idComment?: string
  contentComment: string
  videoAula: VideoAula
  user: User
  stComment: StatusEnum
}

export default Comment
