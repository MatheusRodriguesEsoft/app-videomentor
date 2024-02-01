import { Role } from '@/models/user'
import GenericApi from '../generic-api'
import Student from '@/models/student'

/**
 * API de Aluno
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class StudentAPI extends GenericApi<Student> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao aluno
   */
  public constructor() {
    super({ baseEndpoint: 'students' })
  }
}

export default StudentAPI
