/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import DataCard from '@/components/Card/DataCard'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect } from 'react'
import { BsClipboardData } from 'react-icons/bs'
import { LiaUsersSolid } from 'react-icons/lia'
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
      <Card
        title={'Dados Gerais'}
        icon={<BsClipboardData />}
        content={'subjectsTable'}
        buttons={[]}
      >
        <div className={styles.dataContainer}>
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Alunos'}
            value={222}
            backgroundColor={'rgb(0, 130, 243)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Professores'}
            value={26}
            backgroundColor={'rgb(157, 18, 155)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Turmas'}
            value={26}
            backgroundColor={'rgb(18, 157, 20)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Videoaulas'}
            value={26}
            backgroundColor={'rgb(212, 102, 24)'}
          />
        </div>
      </Card>
    </div>
  )
}
