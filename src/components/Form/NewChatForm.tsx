/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import StatusContentMessageEnum from '@/utils/enumerations/status-content-message-enum'
import StatusMessageEnum from '@/utils/enumerations/status-message-enum'
import { Autocomplete, Grid, TextField } from '@mui/material'
import styles from './styles/NewChatForm.module.css'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import { AuthContext } from '@/contexts/AuthContext'
import SubjectAPI from '@/resources/api/subject'
import MessageAPI from '@/resources/api/message'
import TeacherAPI from '@/resources/api/teacher'
import Subject from '@/models/subject'
import Message from '@/models/message'
import Teacher from '@/models/teacher'
import Swal from 'sweetalert2'
import { Form } from './Form'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import Classe from '@/models/class'
import ClasseAPI from '@/resources/api/classe'
import RoleEnum from '@/utils/enumerations/role-enum'
import Student from '@/models/student'
import StudentAPI from '@/resources/api/student'
import User from '@/models/user'

interface NewChatFormProps {
  setContentChat: Dispatch<SetStateAction<string>>
  setMessage: Dispatch<SetStateAction<Message | undefined>>
}

export function NewChatForm({ setMessage, setContentChat }: NewChatFormProps) {
  const { setContent } = useContext(ActionsContext)
  const { user } = useContext(AuthContext)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [values, setValues] = useState<Message>({
    subject: null,
    classe: null,
    statusMessage: StatusMessageEnum.NEW,
    stMessage: StatusEnum.ACTIVE,
  } as Message)
  const messageApi = new MessageAPI()
  const teacherApi = new TeacherAPI()
  const subjectApi = new SubjectAPI()
  const studentApi = new StudentAPI()
  const classeApi = new ClasseAPI()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  useEffect(() => {
    if (user) {
      setValues({ ...values, user: user } as Message)
    }
  }, [user])

  const getMsgError = (err: string) => {
    Swal.fire({
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Ok',
      title: 'Ocorreu um erro',
      text: 'falha ao carregar os dados',
      icon: 'error',
    })
  }

  function loadData() {
    subjectApi
      .findAll()
      .then(({ data }: any) => {
        setSubjects(data.content as Subject[])
      })
      .catch(getMsgError)
    classeApi
      .findAll()
      .then(({ data }: any) => {
        setClasses(data.content as Classe[])
      })
      .catch(getMsgError)
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (values?.subject) {
      teacherApi
        .findAllByIdSubject(values.subject.idSubject as string)
        .then((res) => setTeachers(res.data as Teacher[]))
        .catch(getMsgError)
    }
  }, [values?.subject])

  useEffect(() => {
    if (values?.classe) {
      studentApi
        .findAllByIdClasse(values.classe.idClasse as string)
        .then((res) => setStudents(res.data as Student[]))
        .catch(getMsgError)
    }
  }, [values.classe])

  const handleChangeSubject = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      subject: newValue,
    }))
  }

  const handleChangeClasse = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      classe: newValue,
    }))
  }

  const handleChangeMessage = (ev: {
    target: { name: any; value: string }
  }) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      contentMessages: [
        {
          content: ev.target.value,
          date: Date.now(),
          user: user,
          statusMessage: StatusContentMessageEnum.SENT,
        },
      ],
    }))
  }

  const handleChangeReceiver = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      receiver: newValue,
    }))
  }

  function send(message: Message) {
    messageApi
      .save({ ...message, createdDate: Date.now(), sender: user as User })
      .then((res) => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Mensagem enviada com sucesso',
          icon: 'success',
        }).then(() => {
          setMessage(res.data)
          setContentChat('contentMessage')
        })
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: 'Falha ao enviar mensagem',
          icon: 'error',
        })
      })
      .finally()
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    send(values as Message)
  }

  const getFieldSubject = () => {
    return (
      <Autocomplete<Subject>
        value={values?.subject ?? null}
        fullWidth
        options={subjects ? subjects.map((s) => s) : []}
        getOptionLabel={(opt) => opt?.nmSubject ?? ''}
        id={'subject'}
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
            fullWidth
            required
            label={'Disciplina'}
            id={'subject'}
            name={'subject'}
            variant={'outlined'}
          />
        )}
      />
    )
  }

  const getFieldClasse = () => {
    return (
      <Autocomplete<Classe>
        value={values?.classe ?? null}
        fullWidth
        options={classes ? classes.map((c) => c) : []}
        getOptionLabel={(opt) => opt?.nmClasse ?? ''}
        id={'classe'}
        onChange={handleChangeClasse}
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
            fullWidth
            required
            label={'Turma'}
            id={'classe'}
            name={'classe'}
            variant={'outlined'}
          />
        )}
      />
    )
  }

  const getFieldTeacher = () => {
    return (
      <Autocomplete<Teacher>
        value={(values?.receiver as Teacher) ?? null}
        fullWidth
        options={teachers ? teachers.map((t) => t) : []}
        getOptionLabel={(opt) => opt?.nmUser ?? ''}
        id={'receiver'}
        onChange={handleChangeReceiver}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.idUser}>
              {option.nmUser}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            required
            disabled={!values?.subject}
            label={'Professor'}
            id={'receiver'}
            name={'receiver'}
            variant={'outlined'}
          />
        )}
      />
    )
  }

  const getFieldStudent = () => {
    return (
      <Autocomplete<Student>
        value={(values?.receiver as Student) ?? null}
        fullWidth
        options={students ? students.map((s) => s) : []}
        getOptionLabel={(opt) => opt?.nmUser ?? ''}
        id={'reveiver'}
        onChange={handleChangeReceiver}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.idUser}>
              {option.nmUser}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            required
            disabled={!values?.classe}
            label={'Aluno'}
            id={'receiver'}
            name={'receiver'}
            variant={'outlined'}
          />
        )}
      />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.video_data}>
          <Form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                {user?.roles.some((role) => role.nmRole === RoleEnum.STUDENT)
                  ? getFieldSubject()
                  : getFieldClasse()}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                {user?.roles.some((role) => role.nmRole === RoleEnum.STUDENT)
                  ? getFieldTeacher()
                  : getFieldStudent()}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  disabled={!values?.receiver}
                  required
                  name={'contentMessage'}
                  label={'Mensagem'}
                  multiline
                  rows={14}
                  maxRows={30}
                  onChange={handleChangeMessage}
                />
              </Grid>
              <Grid item xs={12} className={styles.btn_actions_container}>
                <button
                  type={'button'}
                  className={`${styles.btn} ${styles.btn_cancel}`}
                >
                  Cancelar
                </button>
                <button
                  type={'submit'}
                  className={`${styles.btn} ${styles.btn_send}`}
                >
                  Enviar
                </button>
              </Grid>
            </Grid>
          </Form>
        </div>
      </div>
    </div>
  )
}
