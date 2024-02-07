/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import User from '@/models/user'
import AuthAPI from '@/resources/api/auth'
import UserAPI from '@/resources/api/user'
import UploadAPI from '@/resources/upload-api'
import StatusEnum from '@/utils/enumerations/status-enum'
import { Grid, TextField } from '@mui/material'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { ButtonFab } from '../Button/ButtonFab'
import ButtonFabGroup from '../Button/ButtonFabGroup'
import InputUploadImage from '../Input/InputUploadImage'
import { Form } from './Form'
import styles from './styles/TeacherForm.module.css'

interface UserDataFormProps {
  values: User
  setValues: Dispatch<SetStateAction<User>>
}

export function UserDataForm({ values, setValues }: UserDataFormProps) {
  const { setContent, content, token } = useContext(ActionsContext)
  const [loading, setLoading] = useState<string>('none')
  const [key, setKey] = useState<number>(Math.random())
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const uploadApi = new UploadAPI()
  const authApi = new AuthAPI()
  const userApi = new UserAPI()

  function loadData() {
    if (token) {
      authApi.findUserByToken(token).then(({ data }) => {
        setValues(data as User)
        setKey(Math.random())
      })
    }
  }

  useEffect(() => loadData, [token])

  function update(user: User) {
    userApi
      .update(user)
      .then(({ data }) => {
        setValues(data as User)
        setKey(Math.random())
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
          text: 'Falha ao atualizar os dados',
          icon: 'error',
        })
      })
      .finally()
  }

  async function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()

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
        .catch((err) => console.log(err))
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
            <InputUploadImage
              key={key}
              values={values}
              setValues={setValues}
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
