'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import VideoClasseAPI from '@/resources/api/video-classe'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/SubjectsTable.module.css'
import ButtonGroup from '../Button/ButtonGroup'
import VideoClasse from '@/models/video-classe'
import { useContext, useState } from 'react'
import DataTable from './Table'
import Swal from 'sweetalert2'

interface VideoClassesTableProps {
  dataFiltered: VideoClasse[]
  dataSearch: VideoClasse[]
}

function VideoClassesTable({
  dataFiltered,
}: VideoClassesTableProps): JSX.Element {
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<VideoClasse>()
  const videoClasseApi = new VideoClasseAPI()

  return (
    <div className={styles.container}>
      {dataFiltered.length == 0 && <LinearIndeterminate />}
      <ButtonGroup style={{ right: '0rem' }} buttons={[]} />
      <DataTable<VideoClasse>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            headerName: 'Nome',
            field: 'nmVideoClasse',
            col: 10,
            sort: 'asc',
          },

          {
            headerName: 'Status',
            col: 1,
            field: 'stVideoClasse',
            valueGetter: (params) =>
              params.data.stVideoClasse === StatusEnum.ACTIVE
                ? 'Ativo'
                : 'Inativo',
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
export default VideoClassesTable
