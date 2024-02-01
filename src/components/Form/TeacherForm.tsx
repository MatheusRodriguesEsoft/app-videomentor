/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import StatusPassword from '@/utils/enumerations/status-password'
import { AiOutlineEye, AiOutlinePlus } from 'react-icons/ai'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import { useContext, useEffect, useState } from 'react'
import { generateRandomPassword } from '@/utils/data'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import styles from './styles/TeacherForm.module.css'
import { Switch } from '@/components/Switch/Switch'
import ButtonAction from '../Button/ButtonAction'
import TeacherAPI from '@/resources/api/teacher'
import SubjectAPI from '@/resources/api/subject'
import Notification from '@/models/notification'
import ButtonGroup from '../Button/ButtonGroup'
import { ButtonFab } from '../Button/ButtonFab'
import { FaRegTrashAlt } from 'react-icons/fa'
import { TbLockCog } from 'react-icons/tb'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Teacher from '@/models/teacher'
import Student from '@/models/student'
import DataTable from '../Table/Table'
import Subject from '@/models/subject'
import { Role } from '@/models/user'
import Swal from 'sweetalert2'
import { Form } from './Form'
import {
  Autocomplete,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material'

interface TeacherFormProps {
  teacher: Teacher | undefined
}

export function TeacherForm({ teacher }: TeacherFormProps) {
  const { setContent } = useContext(ActionsContext)

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<Student>()
  const subjectApi = new SubjectAPI()
  const teacherApi = new TeacherAPI()
  const [values, setValues] = useState<Teacher>({
    nmUser: '',
    username: '',
    password: '',
    image: '',
    temporaryPassword: '',
    roles: [] as Role[],
    subjects: [] as Subject[],
    notifications: [] as Notification[],
    stPassword: StatusPassword.PROVISORY,
    stUser: StatusEnum.ACTIVE,
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
    if (teacher != undefined) {
      setValues({
        ...values,
        ...teacher,
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher])

  const handleChangeSubjects = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      subjects: newValue,
    }))
  }

  function save(teacher: Teacher) {
    teacherApi
      .save(teacher)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Usuário registrado com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao registrar usuário',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(teacher: Teacher) {
    teacherApi
      .update(teacher)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Professor atualizado com sucesso',
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
          text: 'Falha ao atualizar os dados do professor',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => {
    loadData()
  }, [])

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (values.idUser == undefined) {
      save(values)
      return
    }
    update(values)
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    if (name === 'stUser') {
      setValues({
        ...values,
        stUser:
          values.stUser === StatusEnum.ACTIVE
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
              id={'nmUser'}
              name={'nmUser'}
              label={'Nome'}
              variant={'outlined'}
              onChange={onChange}
              value={values.nmUser ?? ''}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <TextField
              className={styles.textField}
              fullWidth
              style={{ marginRight: '1.5rem' }}
              type={'email'}
              id={'username'}
              name={'username'}
              label={'Email'}
              disabled={!!teacher}
              variant={'outlined'}
              onChange={onChange}
              value={values.username ?? ''}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete
              multiple
              id={'subjects'}
              options={subjects}
              value={values?.subjects || []}
              onChange={handleChangeSubjects}
              getOptionLabel={(opt) => opt.nmSubject}
              isOptionEqualToValue={(opt, value) =>
                opt.idSubject === value.idSubject
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idSubject}>
                    {option.nmSubject}
                  </li>
                )
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.idSubject}
                    label={option.nmSubject}
                  />
                ))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id={'subjects'}
                  name={'subjects'}
                  label={'Disciplinas'}
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
                  id={'stUser'}
                  name={'stUser'}
                  checked={values.stUser === StatusEnum.ACTIVE ?? true}
                  onChange={onChange}
                />
              }
              label={undefined}
            />
          </Grid>
          {(values.stPassword === StatusPassword.UNCONFIRMED ||
            values.stPassword === StatusPassword.PROVISORY ||
            teacher === undefined) && (
            <>
              <Grid
                className={styles.tempPassword}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <TextField
                  className={styles.textField}
                  fullWidth
                  style={{ marginRight: '0rem' }}
                  type={'text'}
                  id={'temporaryPassword'}
                  name={'temporaryPassword'}
                  label={'Senha Provisória'}
                  variant={'outlined'}
                  onChange={onChange}
                  value={values.temporaryPassword ?? ''}
                />
                <button
                  type={'button'}
                  className={styles.btnGearPass}
                  onClick={() => {
                    const pass = generateRandomPassword(8)
                    setValues({
                      ...values,
                      ...{
                        temporaryPassword: pass,
                        password: pass,
                        stPassword: StatusPassword.PROVISORY,
                      },
                    })
                  }}
                >
                  <TbLockCog className={styles.lockGear} />
                </button>
              </Grid>
            </>
          )}
        </Grid>
        {/* <div className={styles.tableContainer}>
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
                handleClick={() => {}}
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
                col: 6,
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
        </div> */}
        <ButtonFabGroup
          className={styles.buttonFabGroup}
          buttons={[
            <ButtonFab
              key={Math.random()}
              type={'button'}
              variant={'cancel'}
              onClick={() => setContent('teachersTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              {teacher ? (
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
