/* eslint-disable @next/next/no-img-element */
import styles from './styles/AccessModal.module.css'
import AccessForm from '../Form/AccesForm'

interface AccessModalProps {}

export default function AccessModal({}: AccessModalProps) {
  return (
    <div className={styles.container}>
      <AccessForm />
    </div>
  )
}
