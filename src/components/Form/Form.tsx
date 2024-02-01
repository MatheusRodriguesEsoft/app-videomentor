import styles from './styles/Form.module.css'
import { FormEventHandler, ReactNode } from 'react'

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement> | undefined
  children: ReactNode
  className?: string
}

export function Form({ onSubmit, children, className }: FormProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  )
}
