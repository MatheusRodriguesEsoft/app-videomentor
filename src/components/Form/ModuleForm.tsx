/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Autocomplete, FormControlLabel, Grid, TextField } from '@mui/material'
import AreaOfKnowledgeAPI from '@/resources/api/area-of-knowledge'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import AreaOfKnowledge from '@/models/area-of-knowledge'
import { useContext, useEffect, useState } from 'react'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import styles from './styles/ModuleForm.module.css'
import { Switch } from '@/components/Switch/Switch'
import SubjectAPI from '@/resources/api/subject'
import { ButtonFab } from '../Button/ButtonFab'
import { AiOutlineEye, AiOutlinePlus } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Subject from '@/models/subject'
import Swal from 'sweetalert2'
import { Form } from './Form'
import Module from '@/models/module'
import ModuleAPI from '@/resources/api/module'
import ButtonGroup from '../Button/ButtonGroup'
import ButtonAction from '../Button/ButtonAction'
import { FaRegTrashAlt } from 'react-icons/fa'
import DataTable from '../Table/Table'
import VideoAula from '@/models/video-aula'
import VideoaulaAPI from '@/resources/api/videoaula'

interface ModuleFormProps {
  module: Module | undefined
}

export function ModuleForm({ module }: ModuleFormProps) {
  const { setContent } = useContext(ActionsContext)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<VideoAula>()
  const subjectApi = new SubjectAPI()
  const moduleApi = new ModuleAPI()
  const videoaulaApi = new VideoaulaAPI()
  const [values, setValues] = useState<Module>({
    nmModule: '',
    subject: {} as Subject,
    videoAulas: [],
    stModule: StatusEnum.ACTIVE,
  })

  function loadData() {
    subjectApi
      .findAll()
      .then(({ data }: any) => {
        setSubjects(data.content as Subject[])
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          title: 'Ocorreu um erro',
          text: 'falha ao carregar os dados',
          icon: 'error',
        })
      })
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (module != undefined) {
      let subject = subjects?.find(
        (s) => s.idSubject === module.subject?.idSubject
      )

      videoaulaApi
        .findAllByIdModule(module.idModule as string)
        .then((res) =>
          setValues({ ...module, videoAulas: res.data as VideoAula[] })
        )

      setValues({
        ...module,
        ...{ subject: subject as Subject },
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, subjects])

  function save(module: Module) {
    moduleApi
      .save(module)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Módulo registrado com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao registrar módulo',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(module: Module) {
    moduleApi
      .update(module)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Módulo atualizado com sucesso',
          icon: 'success',
        }).then(() => {
          setContent('update')
        })
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao atualizar o módulo',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleChangeSubject(ev: any, subject: any) {
    setValues({ ...values, subject: subject })
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (values.idModule == undefined) {
      save(values)
      return
    }
    update(values)
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    if (name === 'stModule') {
      setValues({
        ...values,
        stModule:
          values.stModule === StatusEnum.ACTIVE
            ? StatusEnum.INACTIVE
            : StatusEnum.ACTIVE,
      })
    } else {
      setValues({ ...values, [name]: value })
    }
  }

  return (
    <div className={styles.container}>
      <Form onSubmit={onSubmit}>
        <Grid container spacing={2} style={{}}>
          <Grid item xs={12} sm={7} md={5} lg={4}>
            <TextField
              className={styles.textField}
              fullWidth
              style={{ marginRight: '1.5rem' }}
              type={'text'}
              id={'nmModule'}
              name={'nmModule'}
              label={'Nome'}
              variant={'outlined'}
              onChange={onChange}
              value={values.nmModule ?? ''}
            />
          </Grid>

          <Grid item xs={12} sm={7} md={5} lg={4}>
            <Autocomplete<Subject>
              value={values.subject ?? null}
              options={subjects ? subjects.map((s) => s) : []}
              getOptionLabel={(opt) => opt?.nmSubject ?? ''}
              style={{ marginRight: '1.5rem' }}
              id={'subjetc'}
              onChange={handleChangeSubject}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idSubject}>
                    {option.nmSubject}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Disciplina'}
                  id={'subject'}
                  name={'subejct'}
                  variant={'outlined'}
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            md={2}
            lg={1}
            style={{ marginTop: '1rem', marginLeft: '.8rem' }}
          >
            <FormControlLabel
              control={
                <Switch
                  label={'Ativo'}
                  id={'stModule'}
                  name={'stModule'}
                  checked={values.stModule === StatusEnum.ACTIVE ?? true}
                  onChange={onChange}
                />
              }
              label={undefined}
            />
          </Grid>
        </Grid>
        <div className={styles.tableContainer}>
          <div className={styles.tableTitle}>
            <span className={styles.title}>Videoaulas</span>
          </div>
          <ButtonGroup
            style={{ right: '0rem' }}
            buttons={[
              <ButtonAction
                key={Math.random()}
                handleClick={() => {}}
                variant={selected ? 'secondary' : 'disabled'}
                icon={<AiOutlineEye size={28} />}
                disabled={!selected}
              />,
              <ButtonAction
                key={Math.random()}
                handleClick={() => {}}
                variant={selected ? 'delete' : 'disbaled'}
                disabled={!selected}
                icon={<FaRegTrashAlt size={22} />}
              />,
            ]}
          />
          <DataTable<VideoAula>
            columns={[
              {
                headerName: '#',
                col: 1,
                valueGetter: (params) => params.node?.rowIndex,
              },
              {
                headerName: 'Nome',
                field: 'videoTitle',
                col: 10,
                sort: 'asc',
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
            data={values.videoAulas ?? []}
            rowsPerPageEnabled={false}
            rowSelectionType={'single'}
            onSelectRow={setSelected}
          />
        </div>
        <ButtonFabGroup
          className={styles.buttonFabGroup}
          buttons={[
            <ButtonFab
              key={Math.random()}
              type={'button'}
              variant={'cancel'}
              onClick={() => setContent('modulesTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              {module ? (
                <>
                  <BsCheckLg size={20} />
                  {'Salvar'}
                </>
              ) : (
                <>
                  <AiOutlinePlus />
                  {'Cadastrar'}
                </>
              )}
            </ButtonFab>,
          ]}
        />
      </Form>
    </div>
  )
}
