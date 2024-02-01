'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/TeachersTable.module.css'
import ButtonAction from '../Button/ButtonAction'
import TeacherAPI from '@/resources/api/teacher'
import ButtonGroup from '../Button/ButtonGroup'
import { useContext, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiEdit } from 'react-icons/bi'
import Teacher from '@/models/teacher'
import Subject from '@/models/subject'
import DataTable from './Table'
import Swal from 'sweetalert2'

interface TeachersTableProps {
  dataFiltered: Teacher[]
  dataSearch: Teacher[]
  handleEdit: (id: string) => void
}

function TeachersTable({
  dataFiltered,
  handleEdit,
}: TeachersTableProps): JSX.Element {
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<Teacher>()
  const teacherApi = new TeacherAPI()

  const handleDelete = (id: string) => {
    teacherApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Professor deletado com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
  }

  return (
    <div className={styles.container}>
      {dataFiltered.length == 0 && <LinearIndeterminate />}
      <ButtonGroup
        style={{ right: '0rem' }}
        buttons={[
          <ButtonAction
            key={Math.random()}
            handleClick={() => {
              handleEdit(selected?.idUser as string)
              setContent('teacherForm')
            }}
            variant={selected ? 'secondary' : 'disabled'}
            disabled={!selected}
            icon={<BiEdit size={28} />}
          />,
          <ButtonAction
            key={Math.random()}
            handleClick={() => handleDelete(selected?.idUser as string)}
            variant={selected ? 'delete' : 'disbaled'}
            icon={<FiTrash2 size={24} />}
            disabled={!selected}
          />,
        ]}
      />
      <DataTable<Teacher>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            headerName: 'Nome',
            field: 'nmUser',
            col: 3,
            sort: 'asc',
          },
          {
            headerName: 'Disciplina',
            field: 'subjects',
            col: 3,
            cellRendererFramework: (params: {
              data: { subjects: Subject[] }
            }) => {
              const subjectsString = params.data.subjects
                ?.map((subject: Subject) => subject.nmSubject)
                .join(', ')

              return <div className={styles.subjects}>{subjectsString}</div>
            },
          },
          {
            headerName: 'Email',
            field: 'username',
            col: 4,
          },
          {
            headerName: 'Status',
            col: 1,
            field: 'stUser',
            valueGetter: (params) =>
              params.data.stUser === StatusEnum.ACTIVE ? 'Ativo' : 'Inativo',
          },
        ]}
        data={dataFiltered}
        rowsPerPageEnabled={false}
        rowSelectionType={'single'}
        onSelectRow={setSelected}
      />
    </div>
  )
}
export default TeachersTable
