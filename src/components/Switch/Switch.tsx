import { ChangeEvent } from 'react'
import styles from './styles/Switch.module.css'
import { Switch as MuiSwitch } from '@mui/material'

interface SwitchProps {
  label: string
  id: string
  name: string
  checked: boolean
  onChange:
    | ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void)
    | undefined
}

export function Switch({ label, id, name, checked, onChange, ...rest }: SwitchProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={id}>{label}</label>
      <MuiSwitch
        {...rest}
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </div>
  )
}
