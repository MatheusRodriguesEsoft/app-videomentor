import { CSSProperties, MouseEventHandler } from 'react'
import styles from './styles/ButtonAdd.module.css'
import { FaPlus } from 'react-icons/fa'

interface ButtonProps {
  handleClick: MouseEventHandler<HTMLButtonElement>
  style: CSSProperties | undefined
  type: 'button' | 'submit' | 'reset' | undefined
  text: string
  variant: string
}

function ButtonAdd({ handleClick, style, type, text, variant }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      style={style}
      type={type}
      onClick={handleClick}
    >
      <span>
        <FaPlus />
        {text}
      </span>
    </button>
  )
}
export default ButtonAdd