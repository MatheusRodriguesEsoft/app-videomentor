/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { BsClipboardData } from 'react-icons/bs'
import Swal from 'sweetalert2'
import styles from './styles/TeacherDashboard.module.css'

export default function TeacherDashboard() {
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
            setIsClient(true)
          } else if (role.nmRole === RoleEnum.TEACHER) {
            setIsClient(true)
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
        <div className={styles.dataContainer}></div>
      </Card>
    </div>
  ) : null
}
