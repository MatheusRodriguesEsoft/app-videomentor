/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import TeachersTable from '@/components/Table/TeachersTable'
import { TeacherForm } from '@/components/Form/TeacherForm'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import ButtonAdd from '@/components/Button/ButtonAdd'
import styles from './styles/TeachersPage.module.css'
import { PiChalkboardTeacher } from 'react-icons/pi'
import TeacherAPI from '@/resources/api/teacher'
import { Card } from '@/components/Card/Card'
import Teacher from '@/models/teacher'
import Swal from 'sweetalert2'

export default function TeachersPage() {
  const { setContent, content } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<Teacher[]>([])
  const [teacher, setTeacher] = useState<Teacher>()
  const teacherApi = new TeacherAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setTeacher(undefined)
    setContent('teacherForm')
  }

  function loadData() {
    teacherApi.findAll().then((res: any) => {
      setDataFiltered(res.data.content as Teacher[])
    })
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('teachersTable')
    }
  }, [content])

  function handleEdit(id: string) {
    teacherApi
      .findById(id)
      .then((res) => {
        setTeacher(res.data as Teacher)
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
        title={'Professores'}
        icon={<PiChalkboardTeacher />}
        content={'teachersTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'teacherForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Professor'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'teachersTable' && (
          <TeachersTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'teacherForm' && <TeacherForm teacher={teacher} />}
      </Card>
    </div>
  )
}