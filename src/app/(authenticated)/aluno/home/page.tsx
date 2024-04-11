/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/StudentDashboard.module.css'
import InputSearch from '@/components/Input/InputSearch'
import { IoChatboxOutline } from 'react-icons/io5'
import AdsCarousel from '@/components/Carousel/AdsCarousel'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import { PiBookBookmark } from 'react-icons/pi'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import StudentAPI from '@/resources/api/student'
import Link from 'next/link'
import SubjectAPI from '@/resources/api/subject'
import Subject from '@/models/subject'
import RoleEnum from '@/utils/enumerations/role-enum'
import ImageSubjetct from '@/components/Image/ImageSubject'
import ChatModal from '@/components/Modal/ChatModal'
import { ActionsContext } from '@/contexts/ActionsContext'

export default function StudentHome() {
  const { user, openChatModal, setOpenChatModal } = useContext(AuthContext)
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const [subjects, setSubjetcs] = useState<Subject[]>([])
  const videoAulaApi = new VideoaulaAPI()
  const studentApi = new StudentAPI()
  const subjectApi = new SubjectAPI()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  function loadData() {
    subjectApi
      .findAll()
      .then(({ data }: any) => setSubjetcs(data.content as Subject[]))
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao buscar dados',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (user && user.roles.some((role) => role.nmRole === RoleEnum.STUDENT)) {
      studentApi.findById(user?.idUser).then((res) => {
        videoAulaApi
          .findAllByIdClasse(res.data.idClasse as string)
          .then((res: any) => {
            setVideoaulas(res.data)
          })
      })
    }
  }, [user])

  return (
    <div className={styles.container}>
      <div className={styles.top_container}>
        <div className={styles.search_container}>
          <button
            className={styles.btn_chat}
            onClick={() => setOpenChatModal(!openChatModal)}
          >
            <IoChatboxOutline size={26} /> <span>Falar com Professsor</span>
          </button>
          <InputSearch
            type={'search'}
            onChange={undefined}
            value={undefined}
            placeholder={''}
            onClick={undefined}
          />
        </div>
        <div className={styles.subjects_icons_container}>
          <div className={styles.subjects_buttons_container}>
            {subjects &&
              subjects?.map((subject) => (
                <button
                  key={subject.idSubject}
                  className={styles.button}
                  onClick={() => {
                    Swal.fire({
                      title: 'Carregando...',
                    })
                    Swal.showLoading()
                  }}
                >
                  <Link
                    href={`/aluno/subject/${subject.idSubject}`}
                    className={styles.link}
                  >
                    {subject.imageUrl && subject.imageName && (
                      <div style={{ transition: 'all .5s' }}>
                        <ImageSubjetct
                          imageUrl={subject.imageUrl}
                          imageName={subject.imageName}
                          alt={subject.nmSubject}
                        />
                      </div>
                    )}
                    <span>{subject.nmSubject}</span>
                  </Link>
                </button>
              ))}
          </div>
        </div>
        <div className={styles.carousel_container}>
          <AdsCarousel />
        </div>
        <Card
          title={'Videoaulas'}
          icon={<PiBookBookmark />}
          content={'studentsTable'}
          buttons={[]}
        >
          <div className={styles.dataContainer}>
            {videoaulas?.length > 0 &&
              videoaulas?.map((videoaula: VideoAula) => (
                <div key={videoaula.idVideoaula}>
                  <span className={styles.video_title}>{`${
                    videoaula.videoTitle.length > 34
                      ? videoaula.videoTitle.slice(0, 34).concat('...')
                      : videoaula.videoTitle
                  } - ${videoaula.subject.nmSubject}`}</span>
                  <div className={styles.video_player}>
                    <img
                      className={styles.img}
                      src={videoaula.videoThumbnails}
                      alt={videoaula.videoTitle}
                    />
                    <div
                      className={styles.modal_player}
                      onClick={() => {
                        Swal.fire({
                          title: 'Carregando...',
                        })
                        Swal.showLoading()
                        router.replace(
                          `/aluno/videoaula/player/${videoaula.idVideoaula}`
                        )
                      }}
                    >
                      <IoPlay size={45} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
