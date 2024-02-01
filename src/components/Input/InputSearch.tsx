import styles from './styles/InputSearch.module.css'
import { BiSearch } from 'react-icons/bi'
import { MouseEventHandler } from 'react'

interface InputSearchProps {
  type: string
  onChange: any
  value: any
  placeholder: string
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
}
function InputSearch({
  type,
  onChange,
  value,
  placeholder,
  onClick,
}: InputSearchProps) {
  return (
    <>
      <input
        className={styles.input}
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
      <button className={styles.button} onClick={onClick}>
        <BiSearch />
      </button>
    </>
  )
}
export default InputSearch
