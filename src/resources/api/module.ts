import Module from '@/models/module'
import GenericApi from '../generic-api'
import { AxiosResponse } from 'axios'

/**
 * API de Módulos
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class ModuleAPI<E> extends GenericApi<Module> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao módulo
   */
  public constructor() {
    super({ baseEndpoint: 'modules' })
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

export default ModuleAPI
