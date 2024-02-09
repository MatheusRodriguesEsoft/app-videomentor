/* eslint-disable @next/next/no-img-element */
import styles from './styles/DataCard.module.css'

interface DataCardProps {
  icon: JSX.Element
  title: string
  value: string | number
  backgroundColor: string
}

export default function DataCard({ icon, title, value, backgroundColor }: DataCardProps) {
  return (
    <div className={styles.container} style={{backgroundColor: backgroundColor}}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.contentCard}>
        <div className={styles.contentTitle}>{title}</div>
        <div className={styles.contentTitle}>{value}</div>
      </div>
    </div>
  )
}
