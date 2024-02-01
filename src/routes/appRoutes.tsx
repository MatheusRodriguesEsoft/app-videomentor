import VideoClassesPage from '@/app/(authenticated)/videoaulas/page'
import SubjectsPage from '@/app/(authenticated)/disciplinas/page'
import TeachersPage from '@/app/(authenticated)/professores/page'
import Dashboard from '@/app/(authenticated)/dashboard/page'
import StudentsPage from '@/app/(authenticated)/alunos/page'
import styles from './styles/AppRoutes.module.css'
import { TbLayoutDashboard } from 'react-icons/tb'
import { Route } from '@/utils/interfaces/Route'
import {
  PiBookBookmark,
  PiChalkboardTeacher,
  PiStudentLight,
  PiUsersFour,
  PiVideo,
} from 'react-icons/pi'

const appRoutes: Route[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    index: true,
    state: 'Dashboard',
    content: 'dashboard',
    sidebarProps: {
      displayText: 'Dashboard',
      icon: <TbLayoutDashboard size={24} className={styles.lightIcon} />,
    },
  },
  {
    path: '/disciplinas',
    element: <SubjectsPage />,
    state: 'Disciplinas',
    content: 'subjectsTable',
    sidebarProps: {
      displayText: 'Disciplinas',
      icon: <PiBookBookmark size={24} />,
    },
  },
  {
    path: '/professores',
    element: <TeachersPage />,
    state: 'Professores',
    content: 'teachersTable',
    sidebarProps: {
      displayText: 'Professores',
      icon: <PiChalkboardTeacher size={24} className={styles.lightIcon} />,
    },
  },
  {
    path: '/turmas',
    element: <SubjectsPage />,
    state: 'Turmas',
    content: 'classesTable',
    sidebarProps: {
      displayText: 'Turmas',
      icon: <PiUsersFour size={24} />,
    },
  },
  {
    path: '/alunos',
    element: <StudentsPage />,
    state: 'Alunos',
    content: 'studentsTable',
    sidebarProps: {
      displayText: 'Alunos',
      icon: <PiStudentLight size={25} className={styles.lightIcon} />,
    },
  },

  {
    path: '/videoaulas',
    element: <VideoClassesPage />,
    state: 'Videoaulas',
    content: 'videoClassesTable',
    sidebarProps: {
      displayText: 'Videoaulas',
      icon: <PiVideo size={24} />,
    },
  },
]

export default appRoutes
