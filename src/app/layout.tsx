import { PublicProviders } from '@/providers/PublicProviders'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Head from './head'
import './globals.css'

export const metadata = {
  title: 'VideoMentor',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <Head />
      <body>
        <PublicProviders>{children}</PublicProviders>
      </body>
    </html>
  )
}
