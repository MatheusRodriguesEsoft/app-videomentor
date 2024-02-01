import GenericApi from '../generic-api'

/**
 * API da Área do Conhecimento
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class AreaOfKnowledgeAPI extends GenericApi<AreaOfKnowledgeAPI> {
  /**
   * Injeta a instância do axios com o endpoint base referente a uma área do conecimento   */
  public constructor() {
    super({ baseEndpoint: 'area-of-knowledge' })
  }
}

export default AreaOfKnowledgeAPI
