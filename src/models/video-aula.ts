import StatusEnum from '@/utils/enumerations/status-enum'
import Classe from './class'
import Subject from './subject'
import VideoYoutube from './video-youtube'
/**
 * Modelo de uma videoaula
 *
 * @author Matheus Rodrigues
 */

interface VideoAula {
  idVideoaula?: string
  idTeacher: string
  video: VideoYoutube
  subject: Subject
  classe: Classe
  title: string
  thumbnails: string
  author: string
  stVideoaula: StatusEnum
}
export default VideoAula
