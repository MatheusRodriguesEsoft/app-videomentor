/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { UserDataForm } from '@/components/Form/UserDataForm'
import { ActionsContext } from '@/contexts/ActionsContext'
import User from '@/models/user'
import AuthAPI from '@/resources/api/auth'
import StatusEnum from '@/utils/enumerations/status-enum'
import StatusPassword from '@/utils/enumerations/status-password'
import { useContext, useEffect, useState } from 'react'
import { RiUserSettingsLine } from 'react-icons/ri'
import Swal from 'sweetalert2'
import styles from './styles/Profile.module.css'

export default function ProfilePage() {
  const { token } = useContext(ActionsContext)
  const [values, setValues] = useState<User>({
    nmUser: '',
    username: '',
    password: '',
    temporaryPassword: '',
    notifications: [] as Notification[],
    stPassword: StatusPassword.PROVISORY,
    stUser: StatusEnum.ACTIVE,
  } as unknown as User)
  const authApi = new AuthAPI()

  const loadData = () => {
    if (token) {
      authApi.findUserByToken(token).then(({ data }) => setValues(data as User))
    }
    setTimeout(() => {
      Swal.close()
    }, 300)
  }

  useEffect(() => {
    loadData()
  }, [token])

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
