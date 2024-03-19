import { ReactNode } from 'react'
import RoleEnum from '../enumerations/role-enum'

export interface Route {
  element: ReactNode
  state: string
  content: string
  index?: boolean
  path?: string
  roles: RoleEnum[]
  child?: Route[]
  sidebarProps?: {
    displayText: string
    icon?: ReactNode
  }
}
