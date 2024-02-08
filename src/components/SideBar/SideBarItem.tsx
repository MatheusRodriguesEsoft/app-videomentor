'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import { Route } from '@/utils/interfaces/Route'
import Link from 'next/link'
import { useContext } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/SideBarItem.module.css'

type Props = {
  item: Route
  isSidebarOpen: boolean
}

const SidebarItem = ({ item, isSidebarOpen }: Props) => {
  const { setContent } = useContext(ActionsContext)
  return item.sidebarProps && item.path ? (
    <div className={styles.list}>
      <Link
        className={styles.link}
        href={item.path}
        onClick={() => {
          setContent(item.content)
          Swal.fire({
            title: 'Carregando...',
          })
          Swal.showLoading()
        }}
        passHref
        style={
          {
            // color: router.pathname === item.path ? 'rgb(166,0,255)' : '#000',
          }
        }
      >
        <span style={{}}>{item.sidebarProps.icon}</span>
        <span
          style={{
            display: !isSidebarOpen ? 'none' : 'inherit',
            marginLeft: '1.2rem',
          }}
        >
          {item.state}
        </span>
      </Link>
    </div>
  ) : null
}

export default SidebarItem
