'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/SubjectsTable.module.css'
import ButtonAction from '../Button/ButtonAction'
import SubjectAPI from '@/resources/api/subject'
import ButtonGroup from '../Button/ButtonGroup'
import { AiOutlineEye } from 'react-icons/ai'
import { useContext, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiEdit } from 'react-icons/bi'
import Subject from '@/models/subject'
import DataTable from './Table'
import Swal from 'sweetalert2'

interface SubjectsTableProps {
  dataFiltered: Subject[]
  dataSearch: Subject[]
  handleEdit: (id: string) => void
}

function SubjectsTable({
  dataFiltered,
  handleEdit,
}: SubjectsTableProps): JSX.Element {
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<Subject>()
  const subjectApi = new SubjectAPI()

  const handleDelete = (id: string) => {
    subjectApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Disciplina deletada com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
      .catch((err: any) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao deletar a disciplina',
          icon: 'error',
        })
      })
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
              handleEdit(selected?.idSubject as string)
              setContent('subjectForm')
            }}
            variant={selected ? 'secondary' : 'disabled'}
            disabled={!selected}
            icon={<BiEdit size={28} />}
          />,
          <ButtonAction
            key={Math.random()}
            handleClick={() => handleDelete(selected?.idSubject as string)}
            variant={selected ? 'delete' : 'disbaled'}
            icon={<FiTrash2 size={24} />}
            disabled={!selected}
          />,
        ]}
      />
      <DataTable<Subject>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            headerName: 'Nome',
            field: 'nmSubject',
            col: 3,
            sort: 'asc',
          },
          {
            headerName: 'Área do conhecimento',
            field: 'areaOfKnowledge.nmAreaOfKnowledge',
            col: 7,
          },
          {
            headerName: 'Status',
            col: 1,
            field: 'stSubject',
            valueGetter: (params) =>
              params.data.stSubject === StatusEnum.ACTIVE ? 'Ativo' : 'Inativo',
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
export default SubjectsTable
