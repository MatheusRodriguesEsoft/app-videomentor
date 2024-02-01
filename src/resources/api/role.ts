import { Role } from '@/models/user'
import GenericApi from '../generic-api'

/**
 * API de Funçao
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 */
class RoleAPI extends GenericApi<Role> {
  /**
   * Injeta a instância do axios com o endpoint base referente a função
   */
  public constructor() {
    super({ baseEndpoint: 'roles' })
  }
}

export default RoleAPI
