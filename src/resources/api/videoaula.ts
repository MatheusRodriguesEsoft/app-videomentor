import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'
import VideoAula from '@/models/video-aula'

/**
 * API de Videoaula
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class VideoaulaAPI<E> extends GenericApi<VideoAula> {
  /**
   * Injeta a instância do axios com o endpoint base referente ao aluno
   */
  public constructor() {
    super({ baseEndpoint: 'videoaulas' })
  }

  /**
   * Busca um objeto da entidade pelo ID
   * - Tipo da propriedade identificadora da entidade, por padrão assume "number"
   *  urd do video
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta com o objeto da entidade referente aquele ID
   */
  public async findVideoByUrl(url: string): Promise<AxiosResponse<E>> {
    const urlParams = new URL(url).searchParams
    const v = urlParams.get('v')
    return this.api.get<E>(`youtube/${v}`)
  }
}

export default VideoaulaAPI
