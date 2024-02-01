import moment from 'moment'

/**
 * Clona um objeto javascript, sendo ele uma instância de um moment, Date, Array ou Object
 *
 * @author Matheus Rodrigues <matheus.rodrigues.esoft@gmail.com>
 * @template T - Tipo do objeto que vai ser clonado
 * @param {T} obj - Objeto que vai ser clonado
 * @returns {T}  Clone do objeto passado por parâmetro
 */
function deepClone<T = any>(obj: T): T {
  let copy: any

  // Handle the 3 simple types, and null or undefined
  if (null === obj || undefined === obj || 'object' != typeof obj) return obj

  // Handle Moment
  if (obj instanceof moment) {
    copy = moment(obj)
    return copy
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr))
        copy[attr] = deepClone(obj[attr])
    }
    return copy
  }

  const msgErro = `Objeto passado por parâmetro para ser clonado é inválido\n${obj}`
  throw new Error(msgErro)
}

export default deepClone
