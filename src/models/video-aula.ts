import StatusEnum from '@/utils/enumerations/status-enum'
import Classe from './class'
import Subject from './subject'
import VideoYoutube from './video-youtube'
import Module from './module'
/**
 * Modelo de uma videoaula
 *
 * @author Matheus Rodrigues
 */

interface VideoAula {
  idVideoaula?: string
  idTeacher: string
  videoId: string | null
  videoTitle: string
  videoThumbnails: string
  videoAuthor: string
  classes: Classe[]
  subject: Subject
  module: Module
  stVideoaula: StatusEnum
}
export default VideoAula
