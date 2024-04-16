/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Switch } from '@/components/Switch/Switch'
import { ActionsContext } from '@/contexts/ActionsContext'
import Classe from '@/models/class'
import Notification from '@/models/notification'
import Student from '@/models/student'
import { Role } from '@/models/user'
import ClassAPI from '@/resources/api/classe'
import StudentAPI from '@/resources/api/student'
import { generateRandomPassword } from '@/utils/data'
import StatusEnum from '@/utils/enumerations/status-enum'
import StatusPassword from '@/utils/enumerations/status-password'
import { Autocomplete, FormControlLabel, Grid, TextField } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { TbLockCog } from 'react-icons/tb'
import Swal from 'sweetalert2'
import { ButtonFab } from '../Button/ButtonFab'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import { Form } from './Form'
import styles from './styles/TeacherForm.module.css'

interface StudentFormProps {
  student: Student | undefined
}

export function StudentForm({ student }: StudentFormProps) {
  const { setContent } = useContext(ActionsContext)
  const [classes, setClasses] = useState<Classe[]>([])
  const studentApi = new StudentAPI()
  const classApi = new ClassAPI()
  const [values, setValues] = useState<Student>({
    nmUser: '',
    username: '',
    password: '',
    imageUrl: '',
    imageName: '',
    temporaryPassword: '',
    roles: [] as Role[],
    notifications: [] as Notification[],
    stPassword: StatusPassword.PROVISORY,
    stUser: StatusEnum.ACTIVE,
  })

  function loadData() {
    classApi
      .findAll()
      .then(({ data }: any) => {
        setClasses(data.content as Classe[])
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao recuperar turmas',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (student != undefined) {
      setValues({
        ...values,
        ...student,
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student])

  function save(student: Student) {
    studentApi
      .save(student)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Aluno registrado com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao registrar aluno',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(student: Student) {
    console.log(student)
    studentApi
      .update(student)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Aluno atualizado com sucesso',
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
            err.response.data.message ?? 'Falha ao atualizar dados do aluno',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (student != undefined) {
      setValues({
        ...values,
        ...student,
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student])

  const handleChangeClass = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      classe: newValue,
    }))
  }

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
              disabled={!!student}
              variant={'outlined'}
              onChange={onChange}
              value={values.username ?? ''}
            />
          </Grid>
          {(values.stPassword === StatusPassword.UNCONFIRMED ||
            values.stPassword === StatusPassword.PROVISORY ||
            student === undefined) && (
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
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete<Classe>
              value={values.classe ?? null}
              options={classes ? classes.map((c) => c) : []}
              getOptionLabel={(opt) => opt?.nmClasse ?? ''}
              isOptionEqualToValue={(opt, value) =>
                opt.idClasse === value.idClasse
              }
              id={'classe'}
              onChange={handleChangeClass}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idClasse}>
                    {option.nmClasse}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Turma'}
                  id={'classe'}
                  name={'classe'}
                  variant={'outlined'}
                />
              )}
            />
          </Grid>
        </Grid>
        <ButtonFabGroup
          className={styles.buttonFabGroup}
          buttons={[
            <ButtonFab
              key={Math.random()}
              type={'button'}
              variant={'cancel'}
              onClick={() => setContent('studentsTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              {student ? (
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
