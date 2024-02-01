import GenericApi from '../generic-api'
import Teacher from '@/models/teacher'

/**
 * API de Professor
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class TeacherAPI extends GenericApi<Teacher> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao professor
   */
  public constructor() {
    super({ baseEndpoint: 'teachers' })
  }
}

export default TeacherAPI
