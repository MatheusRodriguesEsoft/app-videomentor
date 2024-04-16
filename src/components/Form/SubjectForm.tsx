/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Autocomplete, FormControlLabel, Grid, TextField } from '@mui/material'
import AreaOfKnowledgeAPI from '@/resources/api/area-of-knowledge'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import AreaOfKnowledge from '@/models/area-of-knowledge'
import { useContext, useEffect, useState } from 'react'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import styles from './styles/SubjectForm.module.css'
import { Switch } from '@/components/Switch/Switch'
import SubjectAPI from '@/resources/api/subject'
import { ButtonFab } from '../Button/ButtonFab'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Subject from '@/models/subject'
import Swal from 'sweetalert2'
import { Form } from './Form'
import InputUploadImage from '../Input/InputUploadImage'
import UploadAPI from '@/resources/upload-api'
import { defaultImageSubjectURL } from '@/utils/configs/signed-url'

interface SubjectFormProps {
  subject: Subject | undefined
}

export function SubjectForm({ subject }: SubjectFormProps) {
  const { setContent } = useContext(ActionsContext)
  const [loading, setLoading] = useState<string>('none')
  const [deleteFile, setDeleteFile] = useState<string>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [areaOfKnowledges, setAreaOfKnowledges] = useState<AreaOfKnowledge[]>(
    []
  )
  const areaOfKnowledgeApi = new AreaOfKnowledgeAPI()
  const subjectApi = new SubjectAPI()
  const uploadApi = new UploadAPI()
  const [values, setValues] = useState<Subject>({
    nmSubject: '',
    imageUrl: '',
    imageName: '',
    stSubject: StatusEnum.ACTIVE,
  })

  function loadData() {
    areaOfKnowledgeApi
      .findAll()
      .then(({ data }: any) => {
        setAreaOfKnowledges(data.content as AreaOfKnowledge[])
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text:
            err.response.data.message ??
            'Falha ao recuperar áreas do conhecimento',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => loadData, [])

  useEffect(() => {
    if (subject != undefined) {
      let areaOfKnowledge = areaOfKnowledges?.find(
        (c) =>
          c.idAreaOfKnowledge === subject.areaOfKnowledge?.idAreaOfKnowledge
      )
      setValues({
        ...subject,
        ...{ areaOfKnowledge: areaOfKnowledge && areaOfKnowledge },
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, areaOfKnowledges])

  function save(subject: Subject) {
    subjectApi
      .save(subject)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Disciplina registrado com sucesso',
          icon: 'success',
        }).then(() => setContent('update'))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: err.response.data.message ?? 'Falha ao registrar disciplina',
          icon: 'error',
        })
      })
      .finally()
  }

  function update(subject: Subject) {
    subjectApi
      .update(subject)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Disciplina atualizada com sucesso',
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
          text: err.response.data.message ?? 'Falha ao atualizar a disciplina',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleChangeAreaOfKnowledge(ev: any, areaOfKnowledge: any) {
    setValues({ ...values, areaOfKnowledge: areaOfKnowledge })
  }

  async function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    if (deleteFile) {
      uploadApi
        .deleteImages(deleteFile)
        .then()
        .catch((err) => {
          Swal.fire({
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Ok',
            text: err.response.data.message ?? 'Falha ao deletar imagem',
            icon: 'error',
          })
        })
        .finally()
    }
    if (selectedImage) {
      setLoading('flex')
      const formData = new FormData()
      formData.append('file', selectedImage)
      await uploadApi
        .uploadImages(formData)
        .then(({ data }) => {
          let subject = {
            ...values,
            imageName: data.fileName,
            imageUrl: data.fileUrl,
          }
          if (values.idSubject == undefined) {
            save(subject)
            return
          }
          console.log(subject)
          update(subject)
        })
        .catch((err) => {
          Swal.fire({
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Ok',
            text: err.response.data.message ?? 'Falha ao atualizar imagem',
            icon: 'error',
          })
        })
        .finally(() => {
          setLoading('none')
        })
    } else {
      if (values.idSubject == undefined) {
        save(values)
        return
      }
      update(values)
    }
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    if (name === 'stSubject') {
      setValues({
        ...values,
        stSubject:
          values.stSubject === StatusEnum.ACTIVE
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
              id={'nmSubject'}
              name={'nmSubject'}
              label={'Nome'}
              variant={'outlined'}
              onChange={onChange}
              value={values.nmSubject ?? ''}
            />
          </Grid>

          <Grid item xs={12} sm={7} md={5} lg={4}>
            <Autocomplete<AreaOfKnowledge>
              value={values.areaOfKnowledge ?? null}
              options={areaOfKnowledges ? areaOfKnowledges.map((a) => a) : []}
              getOptionLabel={(opt) => opt?.nmAreaOfKnowledge ?? ''}
              style={{ marginRight: '1.5rem' }}
              id={'areaOfKnowledges'}
              onChange={handleChangeAreaOfKnowledge}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.idAreaOfKnowledge}>
                    {option.nmAreaOfKnowledge}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Área do Conhecimento'}
                  id={'areaOfKnowledges'}
                  name={'areaOfKnowledges'}
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
                  id={'stSubject'}
                  name={'stSubject'}
                  checked={values.stSubject === StatusEnum.ACTIVE ?? true}
                  onChange={onChange}
                />
              }
              label={undefined}
            />
          </Grid>
          <Grid item xs={7}>
            <InputUploadImage<Subject>
              alt={`Subject icon`}
              values={values}
              setValues={setValues}
              loading={loading}
              setLoading={setLoading}
              setDeleteFile={setDeleteFile}
              selectedImage={selectedImage}
              defaultImageURL={defaultImageSubjectURL}
              setSelectedImage={setSelectedImage}
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
              onClick={() => setContent('subjectsTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              {subject ? (
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
