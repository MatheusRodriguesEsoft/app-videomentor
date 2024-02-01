/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import StatusPassword from '@/utils/enumerations/status-password'
import { ActionsContext } from '@/contexts/ActionsContext'
import StatusEnum from '@/utils/enumerations/status-enum'
import InputUploadImage from '../Input/InputUploadImage'
import { useContext, useEffect, useState } from 'react'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import styles from './styles/TeacherForm.module.css'
import Notification from '@/models/notification'
import { ButtonFab } from '../Button/ButtonFab'
import { Grid, TextField } from '@mui/material'
import UploadAPI from '@/resources/upload-api'
import UserAPI from '@/resources/api/user'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import User from '@/models/user'
import Swal from 'sweetalert2'
import { Form } from './Form'

interface UserDataFormProps {
  user: User
}

export function UserDataForm({ user }: UserDataFormProps) {
  const { setContent } = useContext(ActionsContext)
  const userApi = new UserAPI()
  const [loading, setLoading] = useState<string>('none')
  const [imageDel, setImageDel] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const uploadApi = new UploadAPI()
  const [values, setValues] = useState<User>({
    nmUser: '',
    username: '',
    password: '',
    temporaryPassword: '',
    notifications: [] as Notification[],
    stPassword: StatusPassword.PROVISORY,
    stUser: StatusEnum.ACTIVE,
  } as User)

  function loadData() {}

  useEffect(() => loadData, [])

  useEffect(() => {
    if (user != undefined) {
      setValues(user)
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function update(user: User) {
    userApi
      .update(user)
      .then(() => {
        Swal.fire({
          showConfirmButton: true,
          showCancelButton: false,
          text: 'Dados atualizados com sucesso',
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
          text: 'Falha ao atualizar os dados',
          icon: 'error',
        })
      })
      .finally()
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (selectedImage) {
      setLoading('flex')
      const formData = new FormData()
      formData.append('file', selectedImage)
      await uploadApi
        .uploadImages(formData)
        .then((res) => update({ ...values, image: res.data.fileUrl }))
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading('none')
        })
      return
    }

    if (imageDel) {
      uploadApi
        .deleteImage(imageDel.slice(43))
        .then(() => {})
        .catch((err) => console.log(err))
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
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputUploadImage
              values={values}
              setValues={setValues}
              imageDel={imageDel}
              setImageDel={setImageDel}
              loading={loading}
              setLoading={setLoading}
              selectedImage={selectedImage}
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
