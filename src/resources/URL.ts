/**
 * Responsável pela memória das URL's das API's do sistema
 *
 * @author Matheus Rodrigues <matheusrodrigues.dev@outlook.com>
 * @abstract
 */
abstract class URL {
  // /**
  //  * URL da API de autenticação
  //  *
  //  * @static
  //  */
  // public static readonly OAUTH = process.env.REACT_APP_URL_OAUTH;

  /**
   * URL da API principal
   *
   * @static
   */
  public static readonly API = 'http://localhost:8080/'

  /**
   * URL da API Upload Images
   *
   * @static
   */
  public static readonly API_UPLOAD_IMAGES = 'http://localhost:3001/'
}

export default URL
