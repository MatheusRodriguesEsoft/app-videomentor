/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import { AuthContext } from '@/contexts/AuthContext'
import User from '@/models/user'
import UserAPI from '@/resources/api/user'
import UploadAPI from '@/resources/upload-api'
import StatusEnum from '@/utils/enumerations/status-enum'
import { Grid, TextField } from '@mui/material'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { ButtonFab } from '../Button/ButtonFab'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import InputUploadImage from '../Input/InputUploadImage'
import { Form } from './Form'
import styles from './styles/TeacherForm.module.css'
import { defaultImageUserURL } from '@/utils/configs/signed-url'

interface UserDataFormProps {
  values: User
  setValues: Dispatch<SetStateAction<User>>
}

export function UserDataForm({ values, setValues }: UserDataFormProps) {
  const { setContent } = useContext(ActionsContext)
  const { setUser, setRenderAvatar } = useContext(AuthContext)
  const [loading, setLoading] = useState<string>('none')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [deleteFile, setDeleteFile] = useState<string>()
  const uploadApi = new UploadAPI()
  const userApi = new UserAPI()

  function update(user: User) {
    userApi
      .update(user)
      .then(({ data }) => {
        setValues(data as User)
        setUser(data as User)
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Dados atualizados com sucesso',
          icon: 'success',
        })
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text:
            err.response.data.message ??
            'Falha ao atualizar os dados do usuário',
          icon: 'error',
        })
      })
      .finally(() => setRenderAvatar(Math.random()))
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
          update({
            ...values,
            imageName: data.fileName,
            imageUrl: data.fileUrl,
          })
        })
        .catch((err) => {
          Swal.fire({
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Ok',
            text:
              err.response.data.message ?? 'Falha ao realizar upload da imagem',
            icon: 'error',
          })
        })
        .finally(() => {
          setLoading('none')
        })
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
              disabled={true}
              variant={'outlined'}
              onChange={onChange}
              value={values.username ?? ''}
            />
          </Grid>
          <Grid item xs={7}>
            <InputUploadImage<User>
              alt={`User avatar`}
              values={values}
              setValues={setValues}
              loading={loading}
              setLoading={setLoading}
              setDeleteFile={setDeleteFile}
              selectedImage={selectedImage}
              defaultImageURL={defaultImageUserURL}
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
              onClick={() => setContent('teachersTable')}
            >
              <IoClose size={20} />
              Voltar
            </ButtonFab>,
            <ButtonFab key={Math.random()} type={'submit'} variant={'save'}>
              <>
                <BsCheckLg size={20} />
                {'Salvar'}
              </>
            </ButtonFab>,
          ]}
        />
      </Form>
    </div>
  )
}
