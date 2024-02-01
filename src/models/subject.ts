import StatusEnum from '@/utils/enumerations/status-enum'
import AreaOfKnowledge from './area-of-knowledge'

/**
 * Modelo de uma disciplina
 *
 */

interface Subject {
  idSubject?: string
  nmSubject: string
  areaOfKnowledge?: AreaOfKnowledge
  stSubject: StatusEnum
}

export default Subject
