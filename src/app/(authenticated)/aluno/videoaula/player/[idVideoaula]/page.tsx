/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/Player.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import ReactPlayer, { Config } from 'react-player'
import Link from 'next/link'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

interface PlayerProps {
  params: any
}

export default function Player({ params }: PlayerProps) {
  const { user } = useContext(AuthContext)
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const [videoClasse, setVideoClasse] = useState<VideoAula>()
  const videoAulaApi = new VideoaulaAPI()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  function loadData() {
    videoAulaApi.findById(params.idVideoaula).then((res) => {
      setVideoClasse(res.data as VideoAula)
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (videoClasse?.module.idModule) {
      videoAulaApi
        .findAllByIdModule(videoClasse?.module.idModule)
        .then((res) => {
          setVideoaulas(res.data as VideoAula[])
        })
    }
  }, [videoClasse])

  const config: Config = {
    youtube: {
      playerVars: {
        showinfo: 0,
        showRelatedVideos: 0,
        controls: 2,
        rel: 0,
        fs: 1,
      },
    },
  }

  return (
    <div className={styles.container}>
      <Card
        title={videoClasse?.subject.nmSubject as string}
        icon={
          <button className={styles.button}>
            <img
              className={styles.icon}
              src={videoClasse?.subject.iconSubject}
              alt={videoClasse?.subject.nmSubject}
            />
          </button>
        }
        content={'videoClassesTable'}
        buttons={[
          <div key={videoClasse?.idVideoaula}>
            <Link className={styles.menu_navigation} href={`/aluno/home`}>
              {'home / '}
            </Link>
            <Link
              className={styles.menu_navigation}
              href={`/aluno/subject/${videoClasse?.subject.idSubject}`}
            >
              {videoClasse?.subject.nmSubject}
            </Link>
            <Link
              className={styles.menu_navigation}
              href={`/aluno/subject/module/${videoClasse?.module.idModule}`}
            >{` / ${videoClasse?.module.nmModule}`}</Link>
            <span
              className={styles.menu_navigation}
            >{` / ${videoClasse?.videoTitle}`}</span>
          </div>,
        ]}
      >
        <div className={styles.data_container}>
          <div className={styles.player_container}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoClasse?.videoId}`}
              controls
              width={'100%'}
              height={'100%'}
              config={config}
              className={styles.react_player}
            />
            <span>{videoClasse?.videoTitle}</span>
          </div>
          <div className={styles.playlist_container}>
            <span className={styles.playlist_title}>
              {`${videoClasse?.module.nmModule}:`}
            </span>
            {videoaulas?.length > 0 &&
              videoaulas?.map((videoaula: VideoAula) => (
                <div
                  key={videoaula.idVideoaula}
                  className={styles.item_playlist}
                >
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
                    {videoaula.idVideoaula != videoClasse?.idVideoaula && (
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
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
