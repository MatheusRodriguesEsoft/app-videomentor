'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/StudentsTable.module.css'
import StudentAPI from '@/resources/api/student'
import ButtonAction from '../Button/ButtonAction'
import ButtonGroup from '../Button/ButtonGroup'
import { useContext, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiEdit } from 'react-icons/bi'
import Student from '@/models/student'
import DataTable from './Table'
import Swal from 'sweetalert2'

interface StudentsTableProps {
  dataFiltered: Student[]
  dataSearch: Student[]
  handleEdit: (id: string) => void
}

function StudentsTable({
  dataFiltered,
  handleEdit,
}: StudentsTableProps): JSX.Element {
  const [selected, setSelected] = useState<Student>()
  const { setContent } = useContext(ActionsContext)
  const studentApi = new StudentAPI()

  const handleDelete = (id: string) => {
    studentApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Aluno deletado com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
  }

  return (
    <div className={styles.container}>
      {dataFiltered.length == 0 && <LinearIndeterminate />}
      <ButtonGroup
        style={{ right: '2.6rem' }}
        buttons={[
          <ButtonAction
            key={Math.random()}
            handleClick={() => {
              handleEdit(selected?.idUser as string)
              setContent('studentForm')
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
      <DataTable<Student>
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
            headerName: 'Login',
            field: 'username',
            col: 4,
          },
          {
            headerName: 'Turma',
            field: 'classe.nmClasse',
            col: 3,
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
export default StudentsTable
