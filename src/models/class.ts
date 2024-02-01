import StatusEnum from '@/utils/enumerations/status-enum'
import Student from './student'
import Teacher from './teacher'

/**
 * Modelo de uma turmas
 *
 */

export interface Serie {
  idSerie?: string
  nmSerie: string
  stSerie: StatusEnum
}

interface Classe {
  idClasse?: string
  nmClasse: string
  serie: Serie
  teachers: Teacher[]
  students: Student[]
  stClasse: StatusEnum
}

export default Classe
