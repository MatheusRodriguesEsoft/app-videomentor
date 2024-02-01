import User from '@/models/user'
import GenericApi from '../generic-api'

/**
 * API de Usuário
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class UserAPI extends GenericApi<User> {
  /**
   * Injeta a instância do axios com o endpoint base referente a um usuário
   */
  public constructor() {
    super({ baseEndpoint: 'users' })
  }
}

export default UserAPI
