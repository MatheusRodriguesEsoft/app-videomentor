'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/ModulesTable.module.css'
import ButtonAction from '../Button/ButtonAction'
import SubjectAPI from '@/resources/api/subject'
import ButtonGroup from '../Button/ButtonGroup'
import { useContext, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiEdit } from 'react-icons/bi'
import DataTable from './Table'
import Module from '@/models/module'
import Swal from 'sweetalert2'
import ModuleAPI from '@/resources/api/module'

interface ModulesTableProps {
  dataFiltered: Module[]
  dataSearch: Module[]
  handleEdit: (id: string) => void
}

function ModulesTable({
  dataFiltered,
  handleEdit,
}: ModulesTableProps): JSX.Element {
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<Module>()
  const moduleApi = new ModuleAPI()

  const handleDelete = (id: string) => {
    moduleApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Módulo deletado com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
      .catch((err: any) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao deletar o módulo',
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
              handleEdit(selected?.idModule as string)
              setContent('moduleForm')
            }}
            variant={selected ? 'secondary' : 'disabled'}
            disabled={!selected}
            icon={<BiEdit size={28} />}
          />,
          <ButtonAction
            key={Math.random()}
            handleClick={() => handleDelete(selected?.idModule as string)}
            variant={selected ? 'delete' : 'disbaled'}
            icon={<FiTrash2 size={24} />}
            disabled={!selected}
          />,
        ]}
      />
      <DataTable<Module>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            headerName: 'Nome',
            field: 'nmModule',
            col: 3,
            sort: 'asc',
          },
          {
            headerName: 'Disciplina',
            field: 'subject.nmSubject',
            col: 5,
          },
          {
            headerName: 'Qtd. Videoaulas',
            field: 'videoAulas',
            col: 2,
            valueGetter: (params) =>
              params.data.videoAulas && params.data.videoAulas.length,
          },
          {
            headerName: 'Status',
            col: 1,
            field: 'stModule',
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
export default ModulesTable
