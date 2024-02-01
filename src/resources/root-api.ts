import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { parseCookies } from 'nookies'
import URL from './URL'

/**
 * Modelo de configurações da instância do Axios
 *
 * @author Matheus Rodrigues <matheusrodrigues.dev@outlook.com>
 * @extends {AxiosRequestConfig}
 */
export interface RootApiConfigs extends AxiosRequestConfig {
  baseEndpoint?: string
}

/**
 * Classe base para ser extendida pelas classes que fazem comunicações com uma API
 *
 * @author Matheus Rodrigues <matheusrodrigues.dev@outlook.com>
 * @abstract Não pode ser instânciada, apenas extendida
 */
abstract class RootApi {
  /**
   * Memória da instância do Axios
   *
   * @protected - Apenas esta classe e classes que a extendem podem acessá-la
   * @type {AxiosInstance}
   */
  protected readonly api: AxiosInstance

  /**
   * Construtor protegido que injeta a instância do Axios
   *
   * @param {RootApiConfigs} [configs={}] - Configurações para criação da instância do axios
   */
  protected constructor(configs: RootApiConfigs = {}) {
    const { ['jwt-videomentor']: token } = parseCookies()

    const baseURL = `${configs.baseURL ?? URL.API}${configs.baseEndpoint ?? ''}`

    this.api = axios.create({ ...configs, baseURL })

    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
}

export default RootApi
