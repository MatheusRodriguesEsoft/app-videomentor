import styles from './styles/ButtonFabGroup.module.css'

interface ButtonFabGroupProps {
  className: string
  buttons: JSX.Element[]
}

function ButtonFabGroup({ buttons, className }: ButtonFabGroupProps) {
  return <div className={`${className} ${styles.container}`}>{buttons}</div>
}
export default ButtonFabGroup
