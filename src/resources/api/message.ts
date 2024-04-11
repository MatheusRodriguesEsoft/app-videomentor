import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'
import Message from '@/models/message'

/**
 * API de Mensagem
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class MessageAPI<E> extends GenericApi<Message> {
  /**
   * Injeta a instância do axios com o endpoint base referente a mensagem
   */
  public constructor() {
    super({ baseEndpoint: 'messages' })
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

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdReceiver(idUser: string): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`receiver/${idUser}`)
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdSender(idUser: string): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`sender/${idUser}`)
  }
}

export default MessageAPI
