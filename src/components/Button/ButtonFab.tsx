import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles/ButtonFab.module.css'

interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant: 'primary' | 'secondary' | 'save' | 'cancel'
}

export function ButtonFab({
  children,
  variant = 'primary',
  ...rest
}: buttonProps) {
  return (
    <button {...rest} className={`${styles.button} ${styles[variant]}`}>
      <span>{children}</span>
    </button>
  )
}
