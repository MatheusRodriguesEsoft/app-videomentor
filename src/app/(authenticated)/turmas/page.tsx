/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import ClassesTable from '@/components/Table/ClassesTable'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import { ClasseForm } from '@/components/Form/ClassForm'
import styles from './styles/TeachersPage.module.css'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { PiChalkboardTeacher } from 'react-icons/pi'
import { Card } from '@/components/Card/Card'
import Swal from 'sweetalert2'
import Classe from '@/models/class'
import ClasseAPI from '@/resources/api/classe'

export default function ClassesPage() {
  const { setContent, content } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<Classe[]>([])
  const [classe, setClasse] = useState<Classe>()
  const classeApi = new ClasseAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setClasse(undefined)
    setContent('classeForm')
  }

  function loadData() {
    classeApi.findAll().then((res: any) => {
      setDataFiltered(res.data.content as Classe[])
    })
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('classesTable')
    }
  }, [content])

  function handleEdit(id: string) {
    classeApi
      .findById(id)
      .then((res) => {
        setClasse(res.data as Classe)
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
        title={'Turmas'}
        icon={<PiChalkboardTeacher />}
        content={'classesTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'classeForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Turma'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'classesTable' && (
          <ClassesTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'classeForm' && <ClasseForm classe={classe} />}
      </Card>
    </div>
  )
}