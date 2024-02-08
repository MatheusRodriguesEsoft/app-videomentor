/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import ButtonAdd from '@/components/Button/ButtonAdd'
import { Card } from '@/components/Card/Card'
import { StudentForm } from '@/components/Form/StudentForm'
import StudentsTable from '@/components/Table/StudentsTable'
import { ActionsContext } from '@/contexts/ActionsContext'
import Student from '@/models/student'
import ClasseAPI from '@/resources/api/classe'
import StudentAPI from '@/resources/api/student'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { PiStudent } from 'react-icons/pi'
import Swal from 'sweetalert2'
import styles from './styles/StudentsPage.module.css'

export default function StudentsPage() {
  const { setContent, content } = useContext(ActionsContext)
  const [dataFiltered, setDataFiltered] = useState<Student[]>([])
  const [student, setStudent] = useState<Student>()
  const studentApi = new StudentAPI()
  const classeApi = new ClasseAPI()

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setStudent(undefined)
    setContent('studentForm')
  }

  const getClasse = async (idClasse: string) => {
    const response = await classeApi.findById(idClasse)
    return response.data
  }

  async function loadData() {
    const response: any = await studentApi.findAll()
    const students = await Promise.all(
      response.data.content.map(async (student: Student) => {
        const classe = await getClasse(student.idClasse as string)
        return {
          ...student,
          classe: classe,
        }
      })
    )
    setDataFiltered(students as Student[])
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData()
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (content === 'update') {
      loadData()
      setContent('studentsTable')
    }
  }, [content])

  async function handleEdit(id: string) {
    try {
      const res = await studentApi.findById(id)
      const classeData = await getClasse(res.data.idClasse as string)
      setStudent({
        ...res.data,
        classe: classeData,
      } as Student)
    } catch (error) {
      Swal.fire({
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Ok',
        title: 'Ocorreu um erro',
        text: 'Falha ao buscar os dados',
        icon: 'error',
      })
    }
  }

  return (
    <div className={styles.container}>
      <Card
        title={'Alunos'}
        icon={<PiStudent />}
        content={'studentsTable'}
        buttons={[
          <ButtonAdd
            style={{
              display: content === 'studentForm' ? 'none' : 'initial',
            }}
            key={Math.random()}
            handleClick={handleButtonClick}
            type={'button'}
            text={'Aluno'}
            variant={'primary'}
          />,
        ]}
      >
        {content === 'studentsTable' && (
          <StudentsTable
            dataFiltered={dataFiltered}
            dataSearch={[]}
            handleEdit={handleEdit}
          />
        )}
        {content === 'studentForm' && <StudentForm student={student} />}
      </Card>
    </div>
  )
}
