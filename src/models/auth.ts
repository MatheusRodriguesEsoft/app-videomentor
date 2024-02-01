/**
 * Modelo de uma autenticação
 *
 */

export interface RdfPassword {
  idUser: string
  temporaryPassword: string
  password: string
  confirmPassword: string
}

interface Auth {
  username: string
  password: string
}

export default Auth
