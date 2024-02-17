/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PiVideo } from 'react-icons/pi'
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
            router.replace('/aluno/dashboard')
          }
        })
      })
    }
  }, [token, router])

  if (!isClient) {
    return null
  }

  const handleButtonClick = () => {}

  return isClient ? (
    <div className={styles.container}>
      <Card
        title={'Videoaulas'}
        icon={<PiVideo size={24} />}
        content={'subjectsTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: 'initial',
            }}
            key={Math.random()}
            handleClick={() => router.replace('/professor/videoaulas/novo')}
            type={'button'}
            text={'Videoaula'}
            variant={'primary'}
          />,
        ]}
      >
        <div className={styles.dataContainer}></div>
      </Card>
    </div>
  ) : null
}
