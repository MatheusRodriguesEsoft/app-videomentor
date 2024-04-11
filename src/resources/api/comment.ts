import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'
import Comment from '@/models/comment'

/**
 * API de Comentário
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class CommentAPI<E> extends GenericApi<Comment> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao comentário
   */
  public constructor() {
    super({ baseEndpoint: 'comments' })
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findAllByIdVideoAula(
    idVideoaula: string
  ): Promise<AxiosResponse<E>> {
    return this.api.get<E>(`videoaula/${idVideoaula}`)
  }
}

export default CommentAPI
