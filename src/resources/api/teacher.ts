import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'
import Teacher from '@/models/teacher'

/**
 * API de Professor
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class TeacherAPI<E> extends GenericApi<Teacher> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao professor
   */
  public constructor() {
    super({ baseEndpoint: 'teachers' })
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdSubject(
    idSubject: string
  ): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`subject/${idSubject}`)
  }
}

export default TeacherAPI
