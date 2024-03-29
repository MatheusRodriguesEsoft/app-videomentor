/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import styles from './styles/LogoCard.module.css'

interface LogoCardProps {}

export default function LogoCard({}: LogoCardProps) {
  return (
    <div className={styles.logoContainer}>
      <h1 className={styles.h1}>VideoMentor</h1>
      <Image
        width={150}
        height={150}
        className={styles.logo}
        src={'/images/logo/logo.png'}
        alt={'logo'}
      />
    </div>
  )
}
