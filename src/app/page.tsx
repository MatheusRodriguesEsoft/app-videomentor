/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import AccessCard from '@/components/Card/AccessCard'
import AccessModal from '@/components/Modal/AccesModal'
import { ActionsContext } from '@/contexts/ActionsContext'
import { AuthContext } from '@/contexts/AuthContext'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { setUser, token } = useContext(AuthContext)
  const { openModal } = useContext(ActionsContext)
  const authApi = new AuthAPI()
  const router = useRouter()

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
          } else if (role.nmRole === RoleEnum.TEACHER) {
            router.replace('/professor/dashboard')
          } else if (role.nmRole === RoleEnum.STUDENT) {
            router.replace('/aluno/home')
          }
        })
      })
    }
  }, [token, router])

  return (
    <main className={styles.main}>
      {openModal && (
        <div className={`${styles.access_modal_container} centered`}>
          <AccessModal />
        </div>
      )}
      <img
        className={styles.bg_main}
        src={'/images/backgrounds/bg-dash-main.jpg'}
        alt={'bg-main'}
      />
      <AccessCard />
    </main>
  )
}
