import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

export const ActionRedefinePassword = () => {
  const { setIsModalOpen, setModalNotificationsOpen } = useContext(AuthContext)
  return (
    <>
      <button
        style={{ width: '100%', marginRight: '0' }}
        onClick={() => {
          setIsModalOpen(true)
          setModalNotificationsOpen(false)
        }}
      >
        Redefinir Senha
      </button>
    </>
  )
}

export const actionsNotifications: (() => JSX.Element)[] = [
  ActionRedefinePassword,
]
