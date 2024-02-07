/* eslint-disable @next/next/no-img-element */
'use client'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/Dashboard.module.css'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <span>Bem vindo {user?.nmUser}</span>
      </div>
    </div>
  )
}
