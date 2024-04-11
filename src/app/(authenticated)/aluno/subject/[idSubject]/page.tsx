/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/SubjectPage.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import ReactPlayer, { Config } from 'react-player'
import Link from 'next/link'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import ImageSubjetct from '@/components/Image/ImageSubject'
import SubjectAPI from '@/resources/api/subject'
import Subject from '@/models/subject'
import ModuleAPI from '@/resources/api/module'
import Module from '@/models/module'
import ModuleCard from '@/components/Card/ModuleCard'

interface SubjectPageProps {
  params: any
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const [subject, setSubject] = useState<Subject>()
  const [modules, setModules] = useState<Module[]>([])
  const subjectApi = new SubjectAPI()
  const moduleApi = new ModuleAPI()

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  function loadData() {
    subjectApi.findById(params.idSubject).then((res) => {
      setSubject(res.data as Subject)
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (subject?.idSubject) {
      moduleApi
        .findAllByIdSubject(subject.idSubject)
        .then((res) => setModules(res.data as Module[]))
    }
  }, [subject])

  return (
    <div className={styles.container}>
      <Card
        title={subject?.nmSubject as string}
        icon={
          <button className={styles.button}>
            {subject?.imageUrl && (
              <ImageSubjetct
                imageUrl={subject.imageUrl}
                imageName={subject.imageName}
                alt={subject.nmSubject}
              />
            )}
          </button>
        }
        content={'videoClassesTable'}
        buttons={[
          <div key={subject?.idSubject}>
            <Link
              onClick={() => {
                Swal.fire({
                  title: 'Carregando...',
                })
                Swal.showLoading()
              }}
              className={styles.menu_navigation}
              href={`/aluno/home`}
            >
              {'home / '}
            </Link>
            <span className={styles.menu_navigation}>{subject?.nmSubject}</span>
          </div>,
        ]}
      >
        <div className={styles.data_container}>
          <span className={styles.title}>Videoaulas:</span>
          {modules &&
            modules.map((module) => (
              <div key={module.idModule} className={styles.moduleCard}>
                <ModuleCard module={module} />
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
