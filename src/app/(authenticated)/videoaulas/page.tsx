/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import VideoClassesTable from '@/components/Table/VideoClassesTables'
import { ActionsContext } from '@/contexts/ActionsContext'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { PiBookBookmark } from 'react-icons/pi'
import Swal from 'sweetalert2'
import styles from './styles/VideoClassePage.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import { VideoClasseForm } from '@/components/Form/VideoClasseForm'

export default function VideoClassesPage() {
  const { content, setContent } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<VideoAula[]>([])
  const [videoClasse, setVideoClasse] = useState<VideoAula>()
  const videoAulaApi = new VideoaulaAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setVideoClasse(undefined)
    setContent('videoClasseForm')
  }

  function loadData() {
    videoAulaApi.findAll().then((res: any) => {
      setDataFiltered(res.data.content as VideoAula[])
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('videoClassesTable')
    }
  }, [content])

  function handleEdit(id: string) {
    videoAulaApi
      .findById(id)
      .then((res) => {
        setVideoClasse(res.data as VideoAula)
      })
      .catch(() => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          title: 'Ocorreu um erro',
          text: 'Falha ao buscar os dados',
          icon: 'error',
        })
      })
      .finally()
  }

  return (
    <div className={styles.container}>
      <Card
        title={'Videoaulas'}
        icon={<PiBookBookmark />}
        content={'videoClassesTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'videoClasseForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Videoaula'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'videoClassesTable' && (
          <VideoClassesTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'videoClasseForm' && (
          <VideoClasseForm videoClasse={videoClasse} />
        )}
      </Card>
    </div>
  )
}
