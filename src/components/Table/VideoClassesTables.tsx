/* eslint-disable @next/next/no-img-element */
'use client'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import styles from './styles/VideoClassesTable.module.css'
import ButtonGroup from '../Button/ButtonGroup'
import { useContext, useState } from 'react'
import DataTable from './Table'
import VideoAula from '@/models/video-aula'
import VideoaulaAPI from '@/resources/api/videoaula'
import ButtonAction from '../Button/ButtonAction'
import { BiEdit } from 'react-icons/bi'
import { FiTrash2 } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { AuthContext } from '@/contexts/AuthContext'
import RoleEnum from '@/utils/enumerations/role-enum'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

interface VideoClassesTableProps {
  dataFiltered: VideoAula[]
  dataSearch: VideoAula[]
  handleEdit: (id: string) => void
}

function VideoClassesTable({
  dataFiltered,
  handleEdit,
}: VideoClassesTableProps): JSX.Element {
  const { user } = useContext(AuthContext)
  const { setContent } = useContext(ActionsContext)
  const [selected, setSelected] = useState<VideoAula>()
  const videoAulaApi = new VideoaulaAPI()
  const router = useRouter()

  const handleDelete = (id: string) => {
    videoAulaApi
      .deleteById(id)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Videoaula deletada com sucesso!',
          icon: 'success',
        })
      })
      .then(() => setContent('update'))
  }

  return (
    <div className={styles.container}>
      {dataFiltered.length == 0 && <LinearIndeterminate />}
      <ButtonGroup
        style={{
          right: '0rem',
          display: user?.roles.some((role) => role.nmRole === RoleEnum.STUDENT)
            ? 'none'
            : 'flex',
        }}
        buttons={[
          <ButtonAction
            key={Math.random()}
            handleClick={() => {
              handleEdit(selected?.idVideoaula as string)
              setContent('videoClasseForm')
            }}
            variant={selected ? 'secondary' : 'disabled'}
            disabled={!selected}
            icon={<BiEdit size={28} />}
          />,
          <ButtonAction
            key={Math.random()}
            handleClick={() => handleDelete(selected?.idVideoaula as string)}
            variant={selected ? 'delete' : 'disbaled'}
            icon={<FiTrash2 size={24} />}
            disabled={!selected}
          />,
        ]}
      />
      <DataTable<VideoAula>
        columns={[
          {
            headerName: '#',
            col: 1,
            valueGetter: (params) => (params.node?.rowIndex as number) + 1,
          },
          {
            field: 'videoThumbnails',
            col: 1,
            cellRendererFramework: (params: {
              data: {
                videoThumbnails: string
                videoTitle: string
                idVideoaula: string
              }
            }) => (
              <div className={styles.video_player}>
                <img
                  className={styles.img}
                  src={params.data.videoThumbnails}
                  alt={params.data.videoTitle}
                />
                <div
                  className={styles.modal_player}
                  onClick={() => {
                    Swal.fire({
                      title: 'Carregando...',
                    })
                    Swal.showLoading()
                    router.replace(
                      `/${
                        user?.roles.some(
                          (role) => role.nmRole === RoleEnum.STUDENT
                        )
                          ? 'aluno'
                          : 'professor'
                      }/videoaula/player/${params.data.idVideoaula}`
                    )
                  }}
                >
                  <IoPlay size={25} />
                </div>
              </div>
            ),
          },
          {
            headerName: 'Título',
            field: 'videoTitle',
            col: 3,
            sort: 'asc',
          },
          {
            headerName: 'Disciplina',
            field: 'subject.nmSubject',
            col: 2,
          },
          {
            headerName: 'Módulo',
            field: 'module.nmModule',
            col: 2,
          },
          {
            headerName: 'Autor',
            field: 'videoAuthor',
            col: 2,
          },
          {
            headerName: 'Status',
            col: 1,
            field: 'stVideoaula',
            valueGetter: (params) =>
              params.data.stVideoaula === StatusEnum.ACTIVE
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
