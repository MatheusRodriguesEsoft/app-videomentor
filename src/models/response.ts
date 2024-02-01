/**
 * Modelo de uma Resposta da API
 *
 * @author Matheus Rodrigues
 */

import { InternalAxiosRequestConfig } from 'axios'

interface Response<T = any, D = any> {
  totalElements: number
  totalPages: number
  paginaAtual: number
  config: InternalAxiosRequestConfig<D>
  pageable: {
    pageNumber: number
  }
  data: {
    content: T[]
  }
}
export default Response

// {
//   "content": [],
//   "pageable": {
//       "sort": {
//           "empty": true,
//           "unsorted": true,
//           "sorted": false
//       },
//       "offset": 0,
//       "pageNumber": 0,
//       "pageSize": 20,
//       "paged": true,
//       "unpaged": false
//   },
//   "last": true,
//   "totalPages": 0,
//   "totalElements": 0,
//   "size": 20,
//   "number": 0,
//   "sort": {
//       "empty": true,
//       "unsorted": true,
//       "sorted": false
//   },
//   "numberOfElements": 0,
//   "first": true,
//   "empty": true
// }
