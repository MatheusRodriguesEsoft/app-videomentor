/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/ModulePage.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import ReactPlayer, { Config } from 'react-player'
import Link from 'next/link'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import ImageSubjetct from '@/components/Image/ImageSubject'
import SubjectAPI from '@/resources/api/subject'
import Subject from '@/models/subject'
import ModuleAPI from '@/resources/api/module'
import Module from '@/models/module'

interface ModulePageProps {
  params: any
}

export default function ModulePage({ params }: ModulePageProps) {
  const { user } = useContext(AuthContext)
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const [module, setModule] = useState<Module>()
  const videoAulaApi = new VideoaulaAPI()
  const moduleApi = new ModuleAPI()

  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  function loadData() {
    moduleApi.findById(params.idModule).then((res) => {
      setModule(res.data as Module)
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (module?.idModule) {
      videoAulaApi.findAllByIdModule(module.idModule).then((res) => {
        setVideoaulas(res.data as VideoAula[])
      })
    }
  }, [module])

  return (
    <div className={styles.container}>
      <Card
        title={module?.nmModule as string}
        icon={[]}
        content={'videoClassesTable'}
        buttons={[
          <div key={module?.idModule}>
            <Link
              onClick={() => {
                Swal.fire({
                  title: 'Carregando...',
                })
                Swal.showLoading()
              }}
              className={styles.menu_navigation}
              href={`/aluno/home`}
            >
              {'home / '}
            </Link>
            <Link
              onClick={() => {
                Swal.fire({
                  title: 'Carregando...',
                })
                Swal.showLoading()
              }}
              className={styles.menu_navigation}
              href={`/aluno/subject/${module?.subject.idSubject}`}
            >
              {module?.subject.nmSubject}
            </Link>
            <span
              className={styles.menu_navigation}
            >{` / ${module?.nmModule}`}</span>
          </div>,
        ]}
      >
        <div className={styles.data_container}>
          {videoaulas?.length > 0 &&
            videoaulas?.map((videoaula: VideoAula) => (
              <div key={videoaula.idVideoaula} className={styles.item_playlist}>
                <span className={styles.video_title}>{`${
                  videoaula.videoTitle.length > 38
                    ? videoaula.videoTitle.slice(0, 38).concat('...')
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
  )
}
