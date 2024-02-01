'use client'
import { ActionsProvider } from '@/contexts/ActionsContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const PublicProviders = ({ children }: ProvidersProps) => {
  return (
    <>
      <AuthProvider>
        <ActionsProvider>{children}</ActionsProvider>
      </AuthProvider>
    </>
  )
}
