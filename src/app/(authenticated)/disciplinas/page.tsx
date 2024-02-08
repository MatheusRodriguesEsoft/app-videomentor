/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import { SubjectForm } from '@/components/Form/SubjectForm'
import SubjectsTable from '@/components/Table/SubjectsTables'
import { ActionsContext } from '@/contexts/ActionsContext'
import Subject from '@/models/subject'
import SubjectAPI from '@/resources/api/subject'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { PiBookBookmark } from 'react-icons/pi'
import Swal from 'sweetalert2'
import styles from './styles/SubjectsPage.module.css'

export default function SubjectsPage() {
  const { content, setContent } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<Subject[]>([])
  const [subject, setSubject] = useState<Subject>()
  const subjectApi = new SubjectAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setSubject(undefined)
    setContent('subjectForm')
  }

  function loadData() {
    subjectApi
      .findAll()
      .then((res: any) => {
        setDataFiltered(res.data.content as Subject[])
      })
      .finally(() =>
        setTimeout(() => {
          Swal.close()
        }, 300)
      )
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('subjectsTable')
    }
  }, [content])

  function handleEdit(id: string) {
    subjectApi
      .findById(id)
      .then((res) => {
        setSubject(res.data as Subject)
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
        title={'Disciplinas'}
        icon={<PiBookBookmark />}
        content={'subjectsTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'subjectForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Disciplina'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'subjectsTable' && (
          <SubjectsTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'subjectForm' && <SubjectForm subject={subject} />}
      </Card>
    </div>
  )
}
