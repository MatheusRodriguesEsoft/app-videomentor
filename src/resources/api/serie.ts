import { Serie } from '@/models/class'
import GenericApi from '../generic-api'

/**
 * API da Série
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class SerieAPI extends GenericApi<Serie> {
  /**
   * Injeta a instância do axios com o endpoint base referente a uma série   */
  public constructor() {
    super({ baseEndpoint: 'series' })
  }
}

export default SerieAPI
