'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/ClassesTable.module.css'
import ButtonAction from '../Button/ButtonAction'
import ButtonGroup from '../Button/ButtonGroup'
import { useContext, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiEdit } from 'react-icons/bi'
import DataTable from './Table'
import Swal from 'sweetalert2'
import Classe from '@/models/class'
import ClasseAPI from '@/resources/api/classe'
import Teacher from '@/models/teacher'

interface ClassesTableProps {
  dataFiltered: Classe[]
  dataSearch: Classe[]
  handleEdit: (id: string) => void
}

function ClassesTable({
  dataFiltered,
  handleEdit,
}: ClassesTableProps): JSX.Element {
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<Classe>()
  const classeApi = new ClasseAPI()

  const handleDelete = (id: string) => {
    classeApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Turma deletada com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text:
            err.response.data.message ??
            'Falha ao deletar turma, verifique se existe algum professor ou aluno registrado na turma',
          icon: 'error',
        })
      })
      .finally()
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
              handleEdit(selected?.idClasse as string)
              setContent('classeForm')
            }}
            variant={selected ? 'secondary' : 'disabled'}
            disabled={!selected}
            icon={<BiEdit size={28} />}
          />,
          <ButtonAction
            key={Math.random()}
            handleClick={() => handleDelete(selected?.idClasse as string)}
            variant={selected ? 'delete' : 'disbaled'}
            icon={<FiTrash2 size={24} />}
            disabled={!selected}
          />,
        ]}
      />
      <DataTable<Classe>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            headerName: 'Nome',
            field: 'nmClasse',
            col: 3,
            sort: 'asc',
          },
          {
            headerName: 'Professores',
            field: 'teachers',
            col: 5,
            cellRendererFramework: (params: {
              data: { teachers: Teacher[] }
            }) => {
              const teachersString = params.data.teachers
                ?.map((teacher: Teacher) => teacher.nmUser)
                .join(', ')

              return <div className={styles.subjects}>{teachersString}</div>
            },
          },
          {
            headerName: 'Série',
            field: 'serie.nmSerie',
            col: 2,
          },
          {
            headerName: 'Status',
            col: 1,
            field: 'stClasse',
            valueGetter: (params) =>
              params.data.stClasse === StatusEnum.ACTIVE ? 'Ativo' : 'Inativo',
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
export default ClassesTable
