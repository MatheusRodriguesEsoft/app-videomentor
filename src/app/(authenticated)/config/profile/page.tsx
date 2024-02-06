/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { UserDataForm } from '@/components/Form/UserDataForm'
import { AuthContext } from '@/contexts/AuthContext'
import User from '@/models/user'
import UserAPI from '@/resources/api/user'
import StatusEnum from '@/utils/enumerations/status-enum'
import StatusPassword from '@/utils/enumerations/status-password'
import { useContext, useEffect, useState } from 'react'
import { RiUserSettingsLine } from 'react-icons/ri'
import Swal from 'sweetalert2'
import styles from './styles/Profile.module.css'

export default function ProfilePage() {
  const { user } = useContext(AuthContext)
  const [values, setValues] = useState<User>({
    nmUser: '',
    username: '',
    password: '',
    temporaryPassword: '',
    notifications: [] as Notification[],
    stPassword: StatusPassword.PROVISORY,
    stUser: StatusEnum.ACTIVE,
  } as unknown as User)
  const userApi = new UserAPI()
  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 200)
  }, [])

  useEffect(() => {
    if (user) setValues(user)
  }, [user])

  return (
    <div className={styles.container}>
      <Card
        title={'Dados do Usuário'}
        icon={<RiUserSettingsLine />}
        content={''}
        buttons={[]}
      >
        <UserDataForm values={values as User} setValues={setValues} />
      </Card>
    </div>
  )
}
