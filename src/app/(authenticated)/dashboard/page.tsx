/* eslint-disable @next/next/no-img-element */
'use client'
import { useContext, useEffect } from 'react'
import styles from './styles/Dashboard.module.css'
import { AuthContext } from '@/contexts/AuthContext'
import Swal from 'sweetalert2'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 200)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <span>Bem vindo {user?.nmUser}</span>
      </div>
    </div>
  )
}
