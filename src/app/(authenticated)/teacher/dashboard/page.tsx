/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect } from 'react'
import { BsClipboardData } from 'react-icons/bs'
import Swal from 'sweetalert2'
import styles from './styles/Dashboard.module.css'

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext)
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])
  return (
    <div className={styles.container}>
      <Card
        title={'Dados Gerais'}
        icon={<BsClipboardData />}
        content={'subjectsTable'}
        buttons={[]}
      >
        <div className={styles.dataContainer}></div>
      </Card>
    </div>
  )
}
