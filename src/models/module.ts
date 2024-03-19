import StatusEnum from '@/utils/enumerations/status-enum'
import VideoAula from './video-aula'
import Subject from './subject'

/**
 * Modelo de um módulo
 *
 */

interface Module {
  idModule?: string
  nmModule: string
  subject: Subject
  videoAulas: VideoAula[]
  stModule: StatusEnum
}

export default Module
