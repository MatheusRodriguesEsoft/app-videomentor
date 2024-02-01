/* eslint-disable @next/next/no-img-element */
'use client'
import { ChangeEventHandler, useContext, useState } from 'react'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import styles from './styles/AccessContentForm.module.css'
import { ActionsContext } from '@/contexts/ActionsContext'
import Visibility from '@mui/icons-material/Visibility'
import AccessButton from '../Button/AccessButton'
import Auth from '@/models/auth'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'

interface AccessContentFormProps {
  values: Auth
  handleOnChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined
}

export default function AccessContentForm({
  values,
  handleOnChange,
}: AccessContentFormProps) {
  const { contentModal } = useContext(ActionsContext)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  return (
    <div className={styles.container}>
      <TextField
        fullWidth
        required
        style={{ marginBottom: '2rem' }}
        type={contentModal === 'studentForm' ? 'email' : 'text'}
        className={styles.text_field}
        id={'username'}
        name={'username'}
        label={
          contentModal === 'studentForm'
            ? 'Email do Aluno'
            : 'Email do Professor'
        }
        onChange={handleOnChange}
        value={values?.username}
      />
      <FormControl fullWidth variant={'outlined'}>
        <InputLabel required className={styles.text_field} htmlFor={'password'}>
          Senha
        </InputLabel>
        <OutlinedInput
          className={styles.text_field}
          style={{ marginBottom: '2rem' }}
          type={showPassword ? 'text' : 'password'}
          id={'password'}
          name={'password'}
          value={values?.password}
          onChange={handleOnChange}
          endAdornment={
            <InputAdornment position={'end'}>
              <IconButton
                aria-label={'toggle password visibility'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge={'end'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={'Senha'}
        />
      </FormControl>
      <AccessButton
        type={'submit'}
        style={{
          width: '28rem',
          marginTop: '2rem',
          height: '3.5rem',
          borderRadius: '5rem',
          backgroundColor: 'var(--theme-color)',
        }}
      />
    </div>
  )
}
