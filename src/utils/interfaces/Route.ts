import { ReactNode } from 'react'

export interface Route {
  element: ReactNode
  state: string
  content: string
  index?: boolean
  path?: string
  child?: Route[]
  sidebarProps?: {
    displayText: string
    icon?: ReactNode
  }
}
