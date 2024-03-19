/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Autocomplete, Chip, Grid, TextField } from '@mui/material'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import styles from './styles/VideoClasseForm.module.css'
import SubjectAPI from '@/resources/api/subject'
import { ButtonFab } from '../Button/ButtonFab'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Subject from '@/models/subject'
import Swal from 'sweetalert2'
import { Form } from './Form'
import VideoAula from '@/models/video-aula'
import { AuthContext } from '@/contexts/AuthContext'
import Classe from '@/models/class'
import AuthAPI from '@/resources/api/auth'
import VideoaulaAPI from '@/resources/api/videoaula'
import ClasseAPI from '@/resources/api/classe'
import { useRouter } from 'next/navigation'
import RoleEnum from '@/utils/enumerations/role-enum'
import YouTube, { YouTubeProps } from 'react-youtube'
import VideoYoutube from '@/models/video-youtube'
import InputSearch from '../Input/InputSearch'
import VideoSkeletonCard from '../Card/VideoSkeletonCard'
import Module from '@/models/module'
import ModuleAPI from '@/resources/api/module'

interface VideoClasseFormProps {
  videoClasse: VideoAula | undefined
}

export function VideoClasseForm({ videoClasse }: VideoClasseFormProps) {
  const { setContent } = useContext(ActionsContext)
  const { user, setUser, token } = useContext(AuthContext)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [values, setValues] = useState<VideoAula>({
    idTeacher: '',
    videoId: null,
    videoTitle: '',
    videoAuthor: '',
    videoThumbnails: '',
    classes: [],
    subject: {} as Subject,
    module: {} as Module,
    stVideoaula: StatusEnum.ACTIVE,
  })

  const authApi = new AuthAPI()
  const videoaulaApi = new VideoaulaAPI()
  const subjectApi = new SubjectAPI()
  const classApi = new ClasseAPI()
  const moduleApi = new ModuleAPI()
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
            router.replace('/aluno/home')
          }
        })
      })
    }
  }, [token, router])

  useEffect(() => {
    if (user) {
      setValues({ ...values, idTeacher: user.idUser as string } as VideoAula)
    }
  }, [user])

  useEffect(() => {
    if (videoClasse != undefined) {
      setValues(videoClasse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoClasse])

  useEffect(() => {
    if (values.subject?.idSubject) {
      moduleApi
        .findAllByIdSubject(values.subject.idSubject)
        .then((res) => setModules(res.data as Module[]))
    }
  }, [values.subject])

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

  const handleChangeClasses = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      classes: newValue,
    }))
  }

  const handleChangeModule = (event: any, newValue: any) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      module: newValue,
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
        setValues({
          ...values,
          videoId: data.id,
          videoTitle: data.title,
          videoAuthor: data.author,
          videoThumbnails: data.thumbnails,
        } as VideoAula)
      })
      .catch((err) =>
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: 'Falha ao pesquisar vídeo',
          icon: 'error',
        })
      )
      .finally(() => Swal.close())
  }

  function save(videoAula: VideoAula) {
    videoaulaApi
      .save(videoAula)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Videoaula registrada com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: 'Falha ao registrar videoaula',
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
          {values?.videoId ? (
            <YouTube
              videoId={values?.videoId}
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
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <TextField
                  className={styles.textField}
                  fullWidth
                  required
                  type={'text'}
                  id={'videoTitle'}
                  name={'videoTitle'}
                  label={'Nome'}
                  variant={'outlined'}
                  onChange={onChange}
                  value={values?.videoTitle ?? ''}
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
                      required
                      label={'Disciplina'}
                      id={'subject'}
                      name={'subject'}
                      variant={'outlined'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <Autocomplete<Module>
                  value={values?.module ?? null}
                  fullWidth
                  options={modules ? modules.map((m) => m) : []}
                  getOptionLabel={(opt) => opt?.nmModule ?? ''}
                  id={'module'}
                  onChange={handleChangeModule}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.idModule}>
                        {option.nmModule}
                      </li>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      disabled={!values.subject?.idSubject}
                      label={'Módulo'}
                      id={'module'}
                      name={'module'}
                      variant={'outlined'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <Autocomplete
                  multiple
                  id={'classes'}
                  options={classes}
                  value={values?.classes || []}
                  onChange={handleChangeClasses}
                  getOptionLabel={(opt) => opt.nmClasse}
                  isOptionEqualToValue={(opt, value) =>
                    opt.idClasse === value.idClasse
                  }
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.idClasse}>
                        {option.nmClasse}
                      </li>
                    )
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.idClasse}
                        label={option.nmClasse}
                      />
                    ))
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id={'classes'}
                      name={'classes'}
                      label={'Turmas'}
                      variant={'outlined'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={'Descrição'}
                  multiline
                  rows={9}
                  maxRows={12}
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
                      onClick={() => setContent('videoClassesTable')}
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
