import Classe from '@/models/class'
import GenericApi from '../generic-api'

/**
 * API de Turma
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class ClasseAPI extends GenericApi<Classe> {
  /**
   * Injeta a instância do axios com o endpoint base referente a turma
   */
  public constructor() {
    super({ baseEndpoint: 'classes' })
  }
}

export default ClasseAPI
