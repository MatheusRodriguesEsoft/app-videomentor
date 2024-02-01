/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import styles from './styles/VideoClassePage.module.css'
import { PiBookBookmark } from 'react-icons/pi'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { ActionsContext } from '@/contexts/ActionsContext'
import ButtonAdd from '@/components/Button/ButtonAdd'
import Subject from '@/models/subject'
import SubjectsTable from '@/components/Table/SubjectsTables'
import { setCookie } from 'nookies'
import { SubjectForm } from '@/components/Form/SubjectForm'
import AreaOfKnowledgeAPI from '@/resources/api/area-of-knowledge'
import SubjectAPI from '@/resources/api/subject'
import StatusEnum from '@/utils/enumerations/status-enum'
import Swal from 'sweetalert2'
import VideoClasse from '@/models/video-classe'
import VideoClasseAPI from '@/resources/api/video-classe'
import VideoClassesTable from '@/components/Table/VideoClassesTables'

export default function VideoClassesPage() {
  const { content, setContent } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<VideoClasse[]>([])
  const [subject, setSubject] = useState<VideoClasse>()
  const videoClasseApi = new VideoClasseAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setSubject(undefined)
    setContent('subjectForm')
  }

  function loadData() {
    videoClasseApi.findAll().then((res: any) => {
      setDataFiltered(res.data.content as VideoClasse[])
    })
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('videoClassesTable')
    }
  }, [content])

  function handleEdit(id: string) {
    videoClasseApi
      .findById(id)
      .then((res) => {
        setSubject(res.data as VideoClasse)
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
              display: 'none',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Disciplina'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'videoClassesTable' && (
          <VideoClassesTable dataFiltered={dataFiltered} dataSearch={[]} />
        )}
      </Card>
    </div>
  )
}
