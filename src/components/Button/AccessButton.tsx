/* eslint-disable @next/next/no-img-element */
import { CSSProperties, MouseEventHandler } from 'react'
import styles from './styles/AccessButton.module.css'
import Button from '@mui/material/Button'

interface AccessButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  style: CSSProperties | undefined
  type: 'button' | 'reset' | 'submit'
}

export default function AccessButton({
  onClick,
  style,
  type,
}: AccessButtonProps) {
  return (
    <div className={styles.container}>
      <Button onClick={onClick} type={type} style={style} variant={'contained'}>
        ACESSAR
      </Button>
    </div>
  )
}
