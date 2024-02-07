/* eslint-disable @next/next/no-img-element */
import { Drawer, List, Stack, Toolbar } from '@mui/material'

import appRoutes from '@/routes/appRoutes'
import Image from 'next/image'
import SidebarItem from './SideBarItem'
import styles from './styles/SideBar.module.css'

interface SideBarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isSidebarOpen }: SideBarProps) => {
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
        <div className={styles.listContainer}>
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
              >
                {isSidebarOpen ? (
                  <div className={styles.logoContainer}>
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
                      className={styles.shortLogo}
                      width={150}
                      height={150}
                      src={'/images/logo/logo.png'}
                      alt={'logo'}
                    />
                  </>
                )}
              </Stack>
            </Toolbar>
            <div className={styles.routesContainer}>
              {appRoutes &&
                appRoutes.map((route, index) => (
                  <SidebarItem
                    item={route}
                    key={index}
                    isSidebarOpen={isSidebarOpen}
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
