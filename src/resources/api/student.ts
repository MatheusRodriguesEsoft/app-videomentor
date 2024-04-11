import { Role } from '@/models/user'
import GenericApi from '../generic-api'
import Student from '@/models/student'
import { AxiosResponse } from 'axios'

/**
 * API de Aluno
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class StudentAPI<E> extends GenericApi<Student> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao aluno
   */
  public constructor() {
    super({ baseEndpoint: 'students' })
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdClasse(idClasse: string): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`classe/${idClasse}`)
  }
}

export default StudentAPI
