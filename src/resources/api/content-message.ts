import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'
import ContentMessage from '@/models/content-message'

/**
 * API de Conteúdo de Mensagem
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class ContentMessageAPI<E> extends GenericApi<ContentMessage> {
  /**
   * Injeta a instância do axios com o endpoint base referente a mensagem
   */
  public constructor() {
    super({ baseEndpoint: 'content-messages' })
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdUser(idUser: string): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`user/${idUser}`)
  }
}

export default ContentMessageAPI
