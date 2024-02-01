import { CSSProperties } from 'react'
import styles from './styles/ButtonGroup.module.css'

interface ButtonGroupProps {
  style?: CSSProperties | undefined
  buttons: JSX.Element[]
}

function ButtonGroup({ style, buttons }: ButtonGroupProps) {
  return (
    <div style={style} className={styles.buttonGroup}>
      {buttons}
    </div>
  )
}
export default ButtonGroup
