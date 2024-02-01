'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import styles from './styles/Card.module.css'
import { ReactNode, useContext } from 'react'

interface CardProps {
  title: string
  content: string
  icon: ReactNode
  buttons: JSX.Element[] | []
  children: ReactNode
}

export function Card({ title, content, icon, buttons, children }: CardProps) {
  const { setContent } = useContext(ActionsContext)
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <p className={styles.title} onClick={() => setContent(content)}>
            {icon}
            <span>{title}</span>
          </p>
          <div className={styles.actionsContainer}>{buttons}</div>
        </div>
      </div>
      {children}
    </div>
  )
}
