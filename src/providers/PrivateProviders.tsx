'use client'
import { ActionsProvider } from '@/contexts/ActionsContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const PrivateProviders = ({ children }: ProvidersProps) => {
  return (
    <>
      <ActionsProvider>{children}</ActionsProvider>
    </>
  )
}
