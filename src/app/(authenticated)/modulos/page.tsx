/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import { SubjectForm } from '@/components/Form/SubjectForm'
import { ActionsContext } from '@/contexts/ActionsContext'
import Subject from '@/models/subject'
import SubjectAPI from '@/resources/api/subject'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { PiBookmarks } from 'react-icons/pi'
import Swal from 'sweetalert2'
import styles from './styles/SubjectsPage.module.css'
import Module from '@/models/module'
import ModulesTable from '@/components/Table/ModulesTables'
import { ModuleForm } from '@/components/Form/ModuleForm'
import ModuleAPI from '@/resources/api/module'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'

export default function ModulesPage() {
  const { content, setContent } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<Module[]>([])
  const [module, setModule] = useState<Module>()
  const moduleApi = new ModuleAPI()
  const videoaulaApi = new VideoaulaAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setModule(undefined)
    setContent('moduleForm')
  }

  function loadData() {
    moduleApi.findAll().then((res: any) => {
      res.data.content.map((module: Module) => {
        videoaulaApi
          .findAllByIdModule(module.idModule as string)
          .then((res) => {
            module.videoAulas = res.data as VideoAula[]
          })
      })
      setDataFiltered(res.data.content as Module[])
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('modulesTable')
    }
  }, [content])

  function handleEdit(id: string) {
    moduleApi
      .findById(id)
      .then((res) => {
        setModule(res.data as Module)
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
        title={'Módulos'}
        icon={<PiBookmarks />}
        content={'modulesTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'moduleForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Módulo'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'modulesTable' && (
          <ModulesTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'moduleForm' && <ModuleForm module={module} />}
      </Card>
    </div>
  )
}
