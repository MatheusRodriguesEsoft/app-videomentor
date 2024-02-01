import styles from './styles/ButtonAction.module.css'

interface ButtonProps {
    handleClick: () => void,
    variant: string,
    disabled: boolean,
    icon: JSX.Element
}

function ButtonAction({ handleClick, icon, variant, disabled }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${
        styles[!disabled ? 'active' : '']
      }`}
      type={'button'}
      disabled={disabled}
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}
export default ButtonAction