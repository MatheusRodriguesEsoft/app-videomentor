export interface ColourOption {
  readonly value: string
  readonly label: string
  readonly color: string
  readonly isFixed?: boolean
  readonly isDisabled?: boolean
}

export const colourOptions: readonly ColourOption[] = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
]

/**
 * Função para mover um item de um array para outra posição
 *
 * @template T - Tipo do array
 * @param {T[]} array - O Array que vai ser movido o item
 * @param {number} oldIndex - O index do item que vai ser movido
 * @param {number} toIndex - O index para qual ele vai ser movido
 */
export function moveItemInArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): void {
  const element = array[fromIndex]
  array.splice(fromIndex, 1)
  array.splice(toIndex, 0, element)
}

export function generateRandomPassword(length: number) {
  const characters =
    'ABaC0DEFGHdI1JKLMNsOPQRSgT2UVfWXYZab3cdefgh4ijklmn5opqr6stu7vwx8yz9'
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    password += characters.charAt(randomIndex)
  }

  return password
}
