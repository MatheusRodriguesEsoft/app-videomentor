/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import { TeacherForm } from '@/components/Form/TeacherForm'
import TeachersTable from '@/components/Table/TeachersTable'
import { ActionsContext } from '@/contexts/ActionsContext'
import Teacher from '@/models/teacher'
import TeacherAPI from '@/resources/api/teacher'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { PiChalkboardTeacher } from 'react-icons/pi'
import Swal from 'sweetalert2'
import styles from './styles/TeachersPage.module.css'

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

  useEffect(() => loadData(), [])

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
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text:
            err.response.data.message ??
            'Falha ao recuperar dados do professor',
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
