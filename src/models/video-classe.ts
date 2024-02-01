import StatusEnum from '@/utils/enumerations/status-enum'
/**
 * Modelo de uma videoaula
 *
 * @author Matheus Rodrigues
 */

interface VideoClasse {
  idVideoClasse?: string
  nmVideoClasse?: string
  stVideoClasse: StatusEnum
}
export default VideoClasse
