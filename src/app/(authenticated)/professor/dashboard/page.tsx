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
import { ActionsContext } from '@/contexts/ActionsContext'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'

export default function TeacherDashboard() {
  const { user, setUser, token } = useContext(AuthContext)
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const { setContent } = useContext(ActionsContext)
  const [isClient, setIsClient] = useState(false)
  const videoAulaApi = new VideoaulaAPI()
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

  function loadData() {
    videoAulaApi.findAll().then((res: any) => {
      setVideoaulas(res.data.content)
    })
  }

  useEffect(() => loadData(), [])

  if (!isClient) {
    return null
  }

  const handleButtonClick = () => {}

  return isClient ? (
    <div className={styles.container}>
      <Card
        title={'Videoaulas'}
        icon={<PiVideo size={24} />}
        content={''}
        buttons={[
          <ButtonAdd
            style={{
              display: 'initial',
            }}
            key={Math.random()}
            handleClick={() => {
              setContent('videoClasseForm')
              router.replace('/videoaulas')
            }}
            type={'button'}
            text={'Videoaula'}
            variant={'primary'}
          />,
        ]}
      >
        <div className={styles.data_container}>
          {videoaulas?.length > 0 &&
            videoaulas?.map((videoaula: VideoAula) => (
              <div key={videoaula.idVideoaula}>
                <span className={styles.video_title}>{`${
                  videoaula.videoTitle.length > 48
                    ? videoaula.videoTitle.slice(0, 48).concat('...')
                    : videoaula.videoTitle
                } - ${videoaula.subject.nmSubject}`}</span>
                <div>
                  <img
                    className={styles.img}
                    src={videoaula.videoThumbnails}
                    alt={videoaula.videoTitle}
                  />
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  ) : null
}
