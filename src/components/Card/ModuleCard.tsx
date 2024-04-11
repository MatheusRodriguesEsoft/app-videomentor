/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import styles from './styles/ModuleCard.module.css'
import Module from '@/models/module'
import VideoaulaAPI from '@/resources/api/videoaula'
import { useEffect, useState } from 'react'
import VideoAula from '@/models/video-aula'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { IoPlay } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
interface ModuleCardProps {
  module: Module
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const [openList, setOpenList] = useState<boolean>(false)
  const videoAulaApi = new VideoaulaAPI()
  const router = useRouter()

  useEffect(() => {
    if (module.idModule) {
      videoAulaApi.findAllByIdModule(module.idModule).then((res) => {
        setVideoaulas(res.data as VideoAula[])
      })
    }
  }, [module])

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <span
          className={styles.listTitle}
          onClick={() => setOpenList(!openList)}
        >{`${module.nmModule}  ( ${videoaulas.length} )`}</span>
        {openList ? <IoIosArrowDown /> : <IoIosArrowUp />}
        {openList &&
          videoaulas?.length > 0 &&
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
    </div>
  )
}
