/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { ButtonFab } from '@/components/Button/ButtonFab'
import ButtonFabGroup from '@/components/Button/ButtonFabGroup'
import VideoSkeletonCard from '@/components/Card/VideoSkeletonCard'
import { Form } from '@/components/Form/Form'
import InputSearch from '@/components/Input/InputSearch'
import { AuthContext } from '@/contexts/AuthContext'
import Classe from '@/models/class'
import Subject from '@/models/subject'
import AuthAPI from '@/resources/api/auth'
import RoleEnum from '@/utils/enumerations/role-enum'
import { Autocomplete, Chip, Grid, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import YouTube, { YouTubeProps } from 'react-youtube'
import Swal from 'sweetalert2'
import styles from './styles/TeacherNewVideoAula.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoYoutube from '@/models/video-youtube'
import VideoAula from '@/models/video-aula'
import SubjectAPI from '@/resources/api/subject'
import ClasseAPI from '@/resources/api/classe'
import { ActionsContext } from '@/contexts/ActionsContext'
import { BsCheckLg } from 'react-icons/bs'

export default function TeacherNewVideoAula() {
  const { setContent } = useContext(ActionsContext)
  const { user, setUser, token } = useContext(AuthContext)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [values, setValues] = useState<VideoAula>()
  const [isClient, setIsClient] = useState(false)
  const authApi = new AuthAPI()
  const videoaulaApi = new VideoaulaAPI()
  const subjectApi = new SubjectAPI()
  const classApi = new ClasseAPI()
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  useEffect(() => {
    if (token) {
      Swal.fire({
        title: 'Carregando...',
      })
      Swal.showLoading()

      authApi.findUserByToken(token).then((res: any) => {
        setUser(res.data)
        res.data.roles.map((role: { nmRole: string }) => {
          if (role.nmRole === RoleEnum.ADMIM) {
            setIsClient(true)
          } else if (role.nmRole === RoleEnum.TEACHER) {
            setIsClient(true)
          } else if (role.nmRole === RoleEnum.STUDENT) {
            router.replace('/student/dashboard')
          }
        })
      })
    }
  }, [token, router])

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
    classApi
      .findAll()
      .then(({ data }: any) => {
        setClasses(data.content as Classe[])
      })
      .catch(getMsgError)
  }

  useEffect(() => loadData(), [])

  if (!isClient) {
    return null
  }

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
      showRelatedVideos: 0,
      rel: 0,
      showinfo: 0,
    },
  }

  const handleChangeSubject = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      subject: newValue,
    }))
  }

  const handleChangeClass = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      classe: newValue,
    }))
  }

  const handleChange = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setSearchTerm(event.target.value)
  }

  function findVideo() {
    Swal.fire({
      title: 'Carregando...',
    })
    Swal.showLoading()
    videoaulaApi
      .findVideoByUrl(searchTerm)
      .then((res) => {
        let data = res.data as VideoYoutube
        setValues({ ...values, video: data } as VideoAula)
      })
      .catch((err) => console.log(err))
      .finally(() => Swal.close())
  }

  function save(videoAula: VideoAula) {
    console.log(videoAula)
    videoaulaApi
      .save(videoAula)
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
          text: 'Falha ao registrar aluno',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(videoAula: VideoAula) {
    videoaulaApi
      .update(videoAula)
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
          text: 'Falha ao atualizar os dados da Videoaula',
          icon: 'error',
        })
      })
      .finally()
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (values?.idVideoaula == undefined) {
      save(values as VideoAula)
      return
    }
    update(values)
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target
    setValues({ ...values, [name]: value } as VideoAula)
  }

  return isClient ? (
    <div className={styles.container}>
      <div className={styles.top_content}>
        <InputSearch
          type={'search'}
          onChange={handleChange}
          value={searchTerm}
          placeholder={'Link da videoaula'}
          onClick={findVideo}
        />
      </div>
      <div className={styles.main_content}>
        <div className={styles.video_player}>
          {values?.video ? (
            <YouTube
              videoId={values?.video.id}
              opts={opts}
              onReady={onPlayerReady}
            />
          ) : (
            <VideoSkeletonCard />
          )}
        </div>
        <div className={styles.video_data}>
          <Form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  className={styles.textField}
                  fullWidth
                  required
                  type={'text'}
                  id={'title'}
                  name={'title'}
                  label={'Nome'}
                  variant={'outlined'}
                  onChange={onChange}
                  value={values?.video?.title ?? ''}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
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
                      label={'Disciplina'}
                      id={'subject'}
                      name={'subject'}
                      variant={'outlined'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <Autocomplete<Classe>
                  value={values?.classe ?? null}
                  options={classes ? classes.map((c) => c) : []}
                  getOptionLabel={(opt) => opt?.nmClasse ?? ''}
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
                      fullWidth
                      label={'Turma'}
                      id={'classe'}
                      name={'classe'}
                      variant={'outlined'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <ButtonFabGroup
                  className={styles.buttonFabGroup}
                  buttons={[
                    <ButtonFab
                      key={Math.random()}
                      type={'button'}
                      variant={'cancel'}
                      onClick={() => {}}
                    >
                      <IoClose size={20} />
                      Voltar
                    </ButtonFab>,
                    <ButtonFab
                      key={Math.random()}
                      type={'submit'}
                      variant={'save'}
                    >
                      {values?.idVideoaula ? (
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
              </Grid>
            </Grid>
          </Form>
        </div>
      </div>
    </div>
  ) : null
}
