/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import DataCard from '@/components/Card/DataCard'
import { AuthContext } from '@/contexts/AuthContext'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { BsClipboardData } from 'react-icons/bs'
import { LiaUsersSolid } from 'react-icons/lia'
import Swal from 'sweetalert2'
import styles from './styles/Dashboard.module.css'

export default function Dashboard() {
  const { user, setUser, token } = useContext(AuthContext)
  const [isClient, setIsClient] = useState(false)
  const authApi = new AuthAPI()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  useEffect(() => {
    if (token) {
      Swal.fire({
        title: 'Carregando...',
      })
      Swal.showLoading()

      authApi.findUserByToken(token).then((res: any) => {
        setUser(res.data)

        res.data.roles.map((role: { nmRole: string }) => {
          if (role.nmRole === RoleEnum.ADMIM) {
            router.replace('/dashboard')
            setIsClient(true)
          } else if (role.nmRole === RoleEnum.TEACHER) {
            router.replace('/teacher/dashboard')
          } else if (role.nmRole === RoleEnum.STUDENT) {
            router.replace('/student/dashboard')
          }
        })
      })
    }
  }, [token, router])

  if (!isClient) {
    return null
  }

  return isClient ? (
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
        <div className={styles.verticalBarChartContainer}>
          {/* <VerticalBarChar />
          <VerticalBarChar /> */}
        </div>
      </Card>
    </div>
  ) : null
}
