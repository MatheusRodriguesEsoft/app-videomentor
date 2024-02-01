import GenericApi from '../generic-api'
import Subject from '@/models/subject'

/**
 * API de Diciplinas
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class SubjectAPI extends GenericApi<Subject> {
  /**
   * Injeta a instância do axios com o endpoint base referente a disciplina
   */
  public constructor() {
    super({ baseEndpoint: 'subjects' })
  }
}

export default SubjectAPI
