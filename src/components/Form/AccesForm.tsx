/* eslint-disable @next/next/no-img-element */
'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import { AuthContext } from '@/contexts/AuthContext'
import TypeUserEnum from '@/utils/enumerations/type-user-enum'
import { FormEvent, useContext, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import SelectUserButton from '../Button/SelectUserButton'
import LogoCard from '../Card/LogoCard'
import AccessContentForm from './AccesContetForm'
import styles from './styles/AccessForm.module.css'

interface AccessFormProps {}

export default function AccessForm({}: AccessFormProps) {
  const { signInTeacher, signInStudent } = useContext(AuthContext)
  const [typeUser, setTypeUser] = useState<TypeUserEnum>(TypeUserEnum.STUDENT)
  const { contentModal, setContentModal, setOpenModal } =
    useContext(ActionsContext)
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  function handleOnChange(ev: { target: { name: string; value: string } }) {
    const { name, value } = ev.target
    setValues({ ...values, [name]: value })
  }
  const buttons = [
    { key: 'studentForm', text: 'Aluno', type: TypeUserEnum.STUDENT },
    { key: 'teacherForm', text: 'Professor', type: TypeUserEnum.TEACHER },
  ]

  async function handleAuthenticated(event: FormEvent) {
    event.preventDefault()

    if (typeUser === TypeUserEnum.TEACHER) {
      await signInTeacher(values)
    }

    if (typeUser === TypeUserEnum.STUDENT) {
      await signInStudent(values)
    }
  }

  const handleCloseModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false)
    }
  }

  return (
    <div
      onClick={handleCloseModal}
      id={'container'}
      className={`${styles.container} centered`}
    >
      <form
        onSubmit={handleAuthenticated}
        onClick={(e) => e.stopPropagation()}
        id={'form'}
        className={styles.form}
      >
        <div className={`${styles.btn_close_container} centered`}>
          <button
            onClick={() => setOpenModal(false)}
            type={'button'}
            className={`${styles.btn_close} centered`}
          >
            <CgClose />
          </button>
        </div>
        <LogoCard />
        <div className={styles.btn_group_container}>
          {buttons.map(({ key, text, type }) => (
            <SelectUserButton
              key={key}
              onClick={() => {
                setContentModal(key)
                setTypeUser(type)
              }}
              color={contentModal === key ? '#fff' : ''}
              bgColor={contentModal === key ? 'var(--theme-color)' : ''}
              variant={contentModal === key ? 'contained' : 'outlined'}
              text={text}
            />
          ))}
        </div>
        <div className={styles.content_form_container}>
          <AccessContentForm values={values} handleOnChange={handleOnChange} />
        </div>
      </form>
    </div>
  )
}
