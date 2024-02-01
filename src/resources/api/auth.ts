import GenericApi from '../generic-api'

/**
 * API de Autenticação
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class AuthAPI extends GenericApi<any> {
  /**
   * Injeta a instância do axios com o endpoint base referente a autenticação
   */
  public constructor() {
    super({ baseEndpoint: 'auth' })
  }
}

export default AuthAPI
