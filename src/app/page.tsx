/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import AccessCard from '@/components/Card/AccessCard'
import AccessModal from '@/components/Modal/AccesModal'
import { ActionsContext } from '@/contexts/ActionsContext'
import { AuthContext } from '@/contexts/AuthContext'
import AuthAPI from '@/resources/api/auth'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { setUser } = useContext(AuthContext)
  const { ['jwt-videomentor']: token } = parseCookies()
  const { openModal } = useContext(ActionsContext)
  const authApi = new AuthAPI()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      Swal.fire({
        title: 'Carregando...',
      })
      // authApi
      //   .findUserByToken(token)
      //   .then((res) => setUser(res.data as User))
      //   .catch((err) => console.log(err))
      Swal.showLoading()
      router.replace('/dashboard')
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
