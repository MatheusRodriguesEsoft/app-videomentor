/* eslint-disable @next/next/no-img-element */
'use client'
import { useContext, useEffect, useState } from 'react'
import styles from './styles/Profile.module.css'
import { AuthContext } from '@/contexts/AuthContext'
import Swal from 'sweetalert2'
import { Form } from '@/components/Form/Form'
import {
  Autocomplete,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material'
import User from '@/models/user'
import UserAPI from '@/resources/api/user'
import StatusEnum from '@/utils/enumerations/status-enum'
import ButtonFabGroup from '@/components/Button/ButtonFabGroup'
import { ButtonFab } from '@/components/Button/ButtonFab'
import { IoClose } from 'react-icons/io5'
import { BsCheckLg } from 'react-icons/bs'
import { Card } from '@/components/Card/Card'
import { RiUserSettingsLine } from 'react-icons/ri'
import { UserDataForm } from '@/components/Form/UserDataForm'

export default function ProfilePage() {
  const { user } = useContext(AuthContext)
  const [values, setValues] = useState<User>({
    nmUser: '',
    stUser: StatusEnum.ACTIVE,
  } as User)
  const userApi = new UserAPI()
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 200)
  }, [])

  useEffect(() => {
    if (user) setValues(user)
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
        }).then(() => {})
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: 'Falha ao atualizar os dados ',
          icon: 'error',
        })
      })
      .finally()
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    update(values as User)
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    setValues({ ...values, [name]: value })
  }
  return (
    <div className={styles.container}>
      <Card
        title={'Dados do Usuário'}
        icon={<RiUserSettingsLine />}
        content={''}
        buttons={[]}
      >
        <UserDataForm user={user as User} />
      </Card>
    </div>
  )
}
