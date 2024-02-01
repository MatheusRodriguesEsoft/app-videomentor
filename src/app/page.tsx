/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import AccessModal from '@/components/Modal/AccesModal'
import AccessCard from '@/components/Card/AccessCard'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import Swal from 'sweetalert2'
import { AuthContext } from '@/contexts/AuthContext'
import User from '@/models/user'
import AuthAPI from '@/resources/api/auth'

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
      console.log(token)

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
