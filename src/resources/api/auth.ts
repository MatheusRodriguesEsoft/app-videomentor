import Auth from '@/models/auth'
import Student from '@/models/student'
import Teacher from '@/models/teacher'
import User from '@/models/user'
import { AxiosResponse } from 'axios'
import GenericApi from '../generic-api'

/**
 * API de Autenticação
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.comr>
 * @extends {RootApi}
 * @template E - Tipo da entidade que vai trafegar na comunicação com a API
 */
class AuthAPI<E> extends GenericApi<any> {
  /**
   * Injeta a instância do axios com o endpoint base referente a autenticação
   */
  public constructor() {
    super({ baseEndpoint: 'auth' })
  }

  /**
   *
   *
   * @param {Auth} values - Valores para salvar
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta e o objeto da entidade com o seus dados novos persistidos
   */
  public async signIn(values: Auth): Promise<AxiosResponse<User>> {
    return this.api.post<User>('/login', values)
  }

  /**
   *
   *
   * @param {Auth} values - Valores para salvar
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta e o objeto da entidade com o seus dados novos persistidos
   */
  public async signInTeacher(values: Auth): Promise<AxiosResponse<Teacher>> {
    console.log(values)
    return this.api.post<Teacher>('/login/teacher', values)
  }

  /**
   *
   *
   * @param {Auth} values - Valores para salvar
   * @returns {Promise<AxiosResponse<E>>} Promise com a resposta e o objeto da entidade com o seus dados novos persistidos
   */
  public async signInStudent(values: Auth): Promise<AxiosResponse<Student>> {
    return this.api.post<Student>('/login/student', values)
  }
}

export default AuthAPI
