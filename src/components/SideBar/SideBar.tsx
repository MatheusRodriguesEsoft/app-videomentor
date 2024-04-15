/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { Drawer, List, Stack, Toolbar } from '@mui/material'

import { AuthContext } from '@/contexts/AuthContext'
import appRoutes from '@/routes/appRoutes'
import { defaultImageUserURL, signedUrl } from '@/utils/configs/signed-url'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import SidebarItem from './SideBarItem'
import styles from './styles/SideBar.module.css'
import RoleEnum from '@/utils/enumerations/role-enum'
import { checkRoles } from '@/utils/functions'
import { Role } from '@/models/user'
import StudentAPI from '@/resources/api/student'
import ClasseAPI from '@/resources/api/classe'
import Classe from '@/models/class'
import { useRouter } from 'next/navigation'

interface SideBarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isSidebarOpen }: SideBarProps) => {
  const { user, renderAvatar } = useContext(AuthContext)
  const [classe, setClasse] = useState<Classe>()
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)
  const [displayUserName, setDisplayUserName] = useState<string>('flex')
  const [opacityUserName, setOpacityUserName] = useState<number>(1)
  const studentApi = new StudentAPI()
  const classeApi = new ClasseAPI()
  const router = useRouter()

  useEffect(() => {
    if (user?.imageUrl && user.imageName) {
      signedUrl(user.imageUrl, user.imageName)
        ?.then((url) => setSignedImageUrl(url))
        .catch(() => setSignedImageUrl(null))
    }

    if (checkRoles([RoleEnum.STUDENT], user?.roles as Role[])) {
      studentApi.findById(user?.idUser).then((res) => {
        classeApi.findById(res.data.idClasse).then((res) => setClasse(res.data))
      })
    }
  }, [user])

  useEffect(() => {
    if (isSidebarOpen) {
      setTimeout(() => {
        setDisplayUserName('flex')
        setOpacityUserName(1)
      }, 200)
    } else {
      setDisplayUserName('none')
      setOpacityUserName(0)
    }
  }, [isSidebarOpen])

  const goToHome = () => {
    if (user?.roles.some((role) => role.nmRole === RoleEnum.STUDENT)) {
      router.replace('/aluno/home')
    }
    if (user?.roles.some((role) => role.nmRole === RoleEnum.TEACHER)) {
      router.replace('/professor/home')
    }
    if (user?.roles.some((role) => role.nmRole === RoleEnum.ADMIM)) {
      router.replace('/dashboard')
    }
  }

  return (
    <div className={styles.container}>
      <Drawer
        className={styles.drawer}
        variant={'permanent'}
        sx={{
          width: isSidebarOpen ? '230px' : '70px',
          display: 'flex',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? '230px' : '70px',
            boxSizing: 'border-box',
            borderRight: '0px',
            background:
              'linear-gradient(16deg, rgba(0, 121, 255, 0.8435574913559174) 0%, rgba(255, 255, 255, 0) 65%, rgba(255, 255, 255, 0) 100%)',
            color: '#fff',
            transition: 'all .2s',
          },
        }}
      >
        <div className={styles.list_container}>
          <List className={styles.list} disablePadding>
            <Toolbar
              sx={{
                marginBottom: '10px',
                backgroundColor: 'transparent',
              }}
            >
              <Stack
                sx={{
                  width: '100%',
                }}
                direction="row"
                justifyContent="center"
                alignItems={'center'}
                className={styles.stack}
                onClick={goToHome}
              >
                {isSidebarOpen ? (
                  <div className={styles.logo_container}>
                    <div>
                      <h1 className={styles.h1}>VideoMentor</h1>
                    </div>
                    <div>
                      <Image
                        className={styles.logo}
                        width={150}
                        height={150}
                        src={'/images/logo/logo.png'}
                        alt={'logo'}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      className={styles.short_logo}
                      width={150}
                      height={150}
                      src={'/images/logo/logo.png'}
                      alt={'logo'}
                    />
                  </>
                )}
              </Stack>
            </Toolbar>
            <div className={styles.routes_container}>
              <div className={styles.data_user_container}>
                <div>
                  <img
                    key={renderAvatar}
                    src={signedImageUrl ?? defaultImageUserURL}
                    className={styles.img}
                    alt={`User avatar`}
                  />
                </div>
                <div
                  className={styles.data_user}
                  style={{
                    display: displayUserName,
                    opacity: opacityUserName,
                    transition: 'all .2s',
                  }}
                >
                  <span className={styles.user_name}>{user?.nmUser}</span>
                  {classe && (
                    <span className={styles.user_nmClasse}>
                      {classe.nmClasse}
                    </span>
                  )}
                  {user &&
                    user?.roles.some(
                      (role) => role.nmRole === RoleEnum.ADMIM
                    ) && (
                      <span className={styles.user_nmClasse}>
                        ADMINISTRADOR
                      </span>
                    )}
                  {user &&
                    user?.roles.some(
                      (role) => role.nmRole === RoleEnum.TEACHER
                    ) && (
                      <span className={styles.user_nmClasse}>PROFESSOR</span>
                    )}
                </div>
              </div>
              {appRoutes &&
                appRoutes.map((route, index) => (
                  <SidebarItem
                    item={route}
                    key={index}
                    isSidebarOpen={isSidebarOpen}
                    userRoles={user?.roles as unknown as RoleEnum[]}
                  />
                ))}
            </div>
          </List>
        </div>
      </Drawer>
    </div>
  )
}
export default Sidebar
