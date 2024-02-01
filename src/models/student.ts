import User from './user'
import Class from './class'
/**
 * Modelo de um aluno
 *
 * @author Matheus Rodrigues
 */

interface Student extends User {
  classe?: Class
  idClasse?: string
}
export default Student
