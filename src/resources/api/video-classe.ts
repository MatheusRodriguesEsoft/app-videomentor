import GenericApi from '../generic-api'
import VideoClasse from '@/models/video-classe'

/**
 * API da Videoaula
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class VideoClasseAPI extends GenericApi<VideoClasse> {
  /**
   * Injeta a instância do axios com o endpoint base referente a uma videoaula   */
  public constructor() {
    super({ baseEndpoint: 'video-classes' })
  }
}

export default VideoClasseAPI
