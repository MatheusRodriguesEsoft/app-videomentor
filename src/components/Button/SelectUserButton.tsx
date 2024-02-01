/* eslint-disable @next/next/no-img-element */
import Button, { ButtonPropsVariantOverrides } from '@mui/material/Button'
import styles from './styles/AccessButton.module.css'
import { OverridableStringUnion } from '@mui/types'
import { MouseEventHandler } from 'react'

interface SelectUserButtonProps {
  text: string
  color: string
  bgColor: string
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
  variant?: OverridableStringUnion<
    'text' | 'outlined' | 'contained',
    ButtonPropsVariantOverrides
  >
}

export default function SelectUserButton({
  text,
  color,
  bgColor,
  variant,
  onClick,
}: SelectUserButtonProps) {
  return (
    <div className={styles.container}>
      <Button
        style={{
          width: '10rem',
          height: '3rem',
          borderRadius: '5rem',
          color: color,
          backgroundColor: bgColor,
        }}
        onClick={onClick}
        variant={variant}
      >
        {text}
      </Button>
    </div>
  )
}
