'use client'
import { ActionsContext } from '@/contexts/ActionsContext'
import { Route } from '@/utils/interfaces/Route'
import Link from 'next/link'
import { useContext } from 'react'
import styles from './styles/SideBarItem.module.css'
import RoleEnum from '@/utils/enumerations/role-enum'
import { checkRoles } from '@/utils/functions'
import { usePathname } from 'next/navigation'

type Props = {
  item: Route
  isSidebarOpen: boolean
  userRoles: RoleEnum[]
}

const SidebarItem = ({ item, isSidebarOpen, userRoles }: Props) => {
  const { setContent } = useContext(ActionsContext)
  const pathname = usePathname()

  return item.sidebarProps && item.path && checkRoles(item.roles, userRoles) ? (
    <div className={styles.list}>
      <Link
        className={styles.link}
        href={item.path}
        onClick={() => {
          setContent(item.content)
        }}
        passHref
        style={{
          backgroundColor:
            pathname === item.path ? 'var(--theme-color)' : 'transparent',
          color: pathname === item.path ? '#FFFFFF' : '#000',
        }}
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
