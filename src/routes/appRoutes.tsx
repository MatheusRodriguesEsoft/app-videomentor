import VideoClassesPage from '@/app/(authenticated)/videoaulas/page'
import SubjectsPage from '@/app/(authenticated)/disciplinas/page'
import TeachersPage from '@/app/(authenticated)/professores/page'
import Dashboard from '@/app/(authenticated)/dashboard/page'
import StudentsPage from '@/app/(authenticated)/alunos/page'
import styles from './styles/AppRoutes.module.css'
import { HiOutlineHome } from 'react-icons/hi'
import { TbLayoutDashboard } from 'react-icons/tb'
import { Route } from '@/utils/interfaces/Route'
import RoleEnum from '@/utils/enumerations/role-enum'
import StudentHome from '@/app/(authenticated)/aluno/home/page'
import ModulesPage from '@/app/(authenticated)/modulos/page'
import TeacherHome from '@/app/(authenticated)/professor/home/page'

import {
  PiBookBookmark,
  PiBookmarks,
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
    roles: [RoleEnum.ADMIM],
    sidebarProps: {
      displayText: 'Dashboard',
      icon: <TbLayoutDashboard size={24} className={styles.lightIcon} />,
    },
  },
  {
    path: '/aluno/home',
    element: <StudentHome />,
    index: true,
    state: 'Home',
    content: 'home',
    roles: [RoleEnum.STUDENT, RoleEnum.ADMIM],
    sidebarProps: {
      displayText: 'Home',
      icon: <HiOutlineHome size={24} className={styles.lightIcon} />,
    },
  },
  {
    path: '/professor/home',
    element: <TeacherHome />,
    index: true,
    state: 'Home',
    content: 'home',
    roles: [RoleEnum.TEACHER],
    sidebarProps: {
      displayText: 'Home',
      icon: <HiOutlineHome size={24} className={styles.lightIcon} />,
    },
  },
  {
    path: '/disciplinas',
    element: <SubjectsPage />,
    state: 'Disciplinas',
    content: 'subjectsTable',
    roles: [RoleEnum.ADMIM, RoleEnum.TEACHER],
    sidebarProps: {
      displayText: 'Disciplinas',
      icon: <PiBookBookmark size={24} />,
    },
  },
  {
    path: '/modulos',
    element: <ModulesPage />,
    state: 'Módulos',
    content: 'modulesTable',
    roles: [RoleEnum.ADMIM, RoleEnum.TEACHER],
    sidebarProps: {
      displayText: 'Módulos',
      icon: <PiBookmarks size={24} />,
    },
  },
  {
    path: '/professores',
    element: <TeachersPage />,
    state: 'Professores',
    content: 'teachersTable',
    roles: [RoleEnum.ADMIM],
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
    roles: [RoleEnum.ADMIM, RoleEnum.TEACHER],
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
    roles: [RoleEnum.ADMIM, RoleEnum.TEACHER],
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
    roles: [RoleEnum.ADMIM, RoleEnum.TEACHER, RoleEnum.STUDENT],
    sidebarProps: {
      displayText: 'Videoaulas',
      icon: <PiVideo size={24} />,
    },
  },
]

export default appRoutes
