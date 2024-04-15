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
import VideoaulaAPI from '@/resources/api/videoaula'
import StudentAPI from '@/resources/api/student'
import TeacherAPI from '@/resources/api/teacher'
import ClasseAPI from '@/resources/api/classe'

export default function Dashboard() {
  const { user, setUser, token } = useContext(AuthContext)
  const [totalVideoAulas, setTotalVideoAulas] = useState<number>(0)
  const [totalStudents, setTotalStudents] = useState<number>(0)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [totalClasses, setTotalClasses] = useState<number>(0)

  const [isClient, setIsClient] = useState(false)
  const authApi = new AuthAPI()
  const videoAulaApi = new VideoaulaAPI()
  const studentApi = new StudentAPI()
  const teacherApi = new TeacherAPI()
  const classeApi = new ClasseAPI()
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
            router.replace('/professor/home')
          } else if (role.nmRole === RoleEnum.STUDENT) {
            router.replace('/aluno/home')
          }
        })
      })
    }

    videoAulaApi
      .searchTotal()
      .then((res) => setTotalVideoAulas(res.data as unknown as number))
    studentApi
      .searchTotal()
      .then((res) => setTotalStudents(res.data as unknown as number))
    teacherApi
      .searchTotal()
      .then((res) => setTotalTeachers(res.data as unknown as number))
    classeApi
      .searchTotal()
      .then((res) => setTotalClasses(res.data as unknown as number))
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
            value={totalStudents as number}
            backgroundColor={'rgb(0, 130, 243)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Professores'}
            value={totalTeachers as number}
            backgroundColor={'rgb(157, 18, 155)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Turmas'}
            value={totalClasses as number}
            backgroundColor={'rgb(18, 157, 20)'}
          />
          <DataCard
            icon={<LiaUsersSolid size={70} />}
            title={'Total Videoaulas'}
            value={totalVideoAulas as number}
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
