/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { AiOutlineEye, AiOutlinePlus } from 'react-icons/ai'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import { Switch } from '@/components/Switch/Switch'
import styles from './styles/ClassForm.module.css'
import ButtonAction from '../Button/ButtonAction'
import { ButtonFab } from '../Button/ButtonFab'
import ButtonGroup from '../Button/ButtonGroup'
import { FaRegTrashAlt } from 'react-icons/fa'
import SerieAPI from '@/resources/api/serie'
import ClassAPI from '@/resources/api/classe'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Student from '@/models/student'
import DataTable from '../Table/Table'
import Subject from '@/models/subject'
import Swal from 'sweetalert2'
import { Form } from './Form'
import Teacher from '@/models/teacher'
import TeacherAPI from '@/resources/api/teacher'
import Classe, { Serie } from '@/models/class'
import {
  Autocomplete,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material'
import StudentAPI from '@/resources/api/student'

interface ClasseFormProps {
  classe: Classe | undefined
  setClasse: Dispatch<SetStateAction<Classe | undefined>>
}

export function ClasseForm({ classe, setClasse }: ClasseFormProps) {
  const { setContent } = useContext(ActionsContext)
  const [serie, setSerie] = useState<Serie>()
  const [series, setSeries] = useState<Serie[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selected, setSelected] = useState<Student>()
  const serieApi = new SerieAPI()
  const classApi = new ClassAPI()
  const teacherApi = new TeacherAPI()
  const studentApi = new StudentAPI()
  const [values, setValues] = useState<Classe>({
    nmClasse: '',
    serie: {} as Serie,
    teachers: [] as Teacher[],
    students: [] as Student[],
    stClasse: StatusEnum.ACTIVE,
  })

  const msnError = () => {
    return Swal.fire({
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Ok',
      title: 'Ocorreu um erro',
      text: 'falha ao carregar os dados',
      icon: 'error',
    })
  }

  function loadData() {
    serieApi
      .findAll()
      .then(({ data }: any) => {
        setSeries(data.content as Serie[])
      })
      .catch((err) => msnError())
    teacherApi
      .findAll()
      .then(({ data }: any) => {
        setTeachers(data.content as Teacher[])
      })
      .catch((err) => msnError())
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (classe != undefined) {
      setValues({
        ...values,
        ...classe,
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classe])

  function save(classe: Classe) {
    classApi
      .save(classe)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Turma registrada com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao registar turma',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(classe: Classe) {
    classApi
      .update(classe)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Turma atualizada com sucesso',
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
          text:
            err.response.data.message ?? 'Falha ao atualizar dados da turma',
          icon: 'error',
        })
      })
      .finally()
  }

  function handleChangeSerie(ev: any, serie: any) {
    setSerie(serie)
    setValues({ ...values, serie: serie })
  }

  const handleChangeTeachers = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      teachers: newValue,
    }))
  }

  const handleDeleteStudent = () => {
    studentApi
    .update({...selected, idClasse: ''} as Student)
    .then(() => {
      Swal.fire({
        showConfirmButton: true,
        showCancelButton: false,
        text: 'Aluno removido com sucesso',
        icon: 'success',
      }).then(() => {
        classApi.findById(classe?.idClasse).then(res => setClasse(res.data))
      })
    })
    .catch((err) => {
      Swal.fire({
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Ok',
        text:
          err.response.data.message ?? 'Falha ao remover aluno',
        icon: 'error',
      })
    })
    .finally()
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (values.idClasse == undefined) {
      save(values)
      return
    }
    update(values)
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    if (name === 'stClasse') {
      setValues({
        ...values,
        stClasse:
          values.stClasse === StatusEnum.ACTIVE
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
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              className={styles.textField}
              fullWidth
              style={{ marginRight: '1.5rem' }}
              type={'text'}
              id={'nmClasse'}
              name={'nmClasse'}
              label={'Nome'}
              variant={'outlined'}
              onChange={onChange}
              value={values.nmClasse ?? ''}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
            <Autocomplete<Serie>
              value={values.serie ?? null}
              options={series ? series.map((s) => s) : []}
              getOptionLabel={(opt) => opt?.nmSerie ?? ''}
              style={{}}
              id={'series'}
              onChange={handleChangeSerie}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idSerie}>
                    {option.nmSerie}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Série'}
                  id={'series'}
                  name={'series'}
                  variant={'outlined'}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Autocomplete
              multiple
              id={'teachers'}
              options={teachers}
              value={values?.teachers || []}
              onChange={handleChangeTeachers}
              getOptionLabel={(opt) => opt.nmUser}
              isOptionEqualToValue={(opt, value) => opt.idUser === value.idUser}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idUser}>
                    {option.nmUser}
                  </li>
                )
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.idUser}
                    label={option.nmUser}
                  />
                ))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id={'teachers'}
                  name={'teachers'}
                  label={'Professores'}
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
                  id={'stClasse'}
                  name={'stClasse'}
                  checked={values.stClasse === StatusEnum.ACTIVE ?? true}
                  onChange={onChange}
                />
              }
              label={undefined}
            />
          </Grid>
        </Grid>
        <div className={styles.tableContainer}>
          <div className={styles.tableTitle}>
            <span className={styles.title}>Alunos</span>
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
                handleClick={handleDeleteStudent}
                variant={selected ? 'delete' : 'disbaled'}
                disabled={!selected}
                icon={<FaRegTrashAlt size={22} />}
              />,
            ]}
          />
          <DataTable<Student>
            columns={[
              {
                headerName: '#',
                col: 1,
                valueGetter: (params) => params.node?.rowIndex,
              },
              {
                headerName: 'Nome',
                field: 'nmUser',
                col: 10,
                sort: 'asc',
              },
              {
                headerName: 'Status',
                col: 1,
                field: 'stUser',
                valueGetter: (params) =>
                  params.data.stUser === StatusEnum.ACTIVE
                    ? 'Ativo'
                    : 'Inativo',
              },
            ]}
            data={values.students ?? []}
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
              onClick={() => setContent('classesTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              {classe ? (
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
