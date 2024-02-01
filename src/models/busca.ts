/**
 * Modelo de uma busca da API
 *
 * @author Matheus Rodrigues
 */
interface Busca {
  page?: number
  sort: string
  size?: number
}
export default Busca
