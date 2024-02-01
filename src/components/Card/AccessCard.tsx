/* eslint-disable @next/next/no-img-element */
import { ActionsContext } from '@/contexts/ActionsContext'
import styles from './styles/AccessCard.module.css'
import AccessButton from '../Button/AccessButton'
import { useContext } from 'react'
import LogoCard from './LogoCard'

interface AccessCardProps {}

export default function AccessCard({}: AccessCardProps) {
  const { setOpenModal } = useContext(ActionsContext)
  return (
    <div className={styles.container}>
      <LogoCard />
      <div className={styles.descriptionContainer}>
        <span className={styles.description}>
          Seja bem-vindo à nossa plataforma educacional inovadora! Conecte-se
          para explorar uma experiência de ensino médio remoto aprimorada, onde
          a tecnologia encontra a educação. Faça login agora e comece sua
          jornada de aprendizado personalizado!
        </span>
      </div>
      <div>
        <AccessButton
          type={'button'}
          style={{
            width: '28rem',
            marginTop: '1rem',
            height: '3.5rem',
            borderRadius: '5rem',
            backgroundColor: 'var(--theme-color)',
          }}
          onClick={() => setOpenModal(true)}
        />
      </div>
    </div>
  )
}
