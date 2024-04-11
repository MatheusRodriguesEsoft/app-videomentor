/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/Card/Card'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './styles/Player.module.css'
import VideoaulaAPI from '@/resources/api/videoaula'
import VideoAula from '@/models/video-aula'
import ReactPlayer, { Config } from 'react-player'
import Link from 'next/link'
import { IoPlay } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import ImageSubjetct from '@/components/Image/ImageSubject'
import { defaultImageUserURL, signedUrl } from '@/utils/configs/signed-url'
import { TextField } from '@mui/material'
import Comment from '@/models/comment'
import StatusEnum from '@/utils/enumerations/status-enum'
import CommentAPI from '@/resources/api/comment'

interface PlayerProps {
  params: any
}

export default function Player({ params }: PlayerProps) {
  const { user, renderAvatar } = useContext(AuthContext)
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)
  const [videoaulas, setVideoaulas] = useState<VideoAula[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [videoClasse, setVideoClasse] = useState<VideoAula>()
  const videoAulaApi = new VideoaulaAPI()
  const commentApi = new CommentAPI()
  const router = useRouter()
  const [comment, setComment] = useState<Comment>({
    stComment: StatusEnum.ACTIVE,
  } as Comment)

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  function loadData() {
    videoAulaApi.findById(params.idVideoaula).then((res) => {
      setVideoClasse(res.data as VideoAula)
    })
  }

  useEffect(() => loadData(), [])

  useEffect(() => {
    if (user?.imageUrl && user.imageName) {
      signedUrl(user.imageUrl, user.imageName)
        ?.then((url) => setSignedImageUrl(url))
        .catch(() => setSignedImageUrl(null))
    }
    if (user) {
      setComment({ ...comment, user: user })
    }
  }, [user])

  useEffect(() => {
    if (videoClasse?.module?.idModule) {
      videoAulaApi
        .findAllByIdModule(videoClasse?.module.idModule)
        .then((res) => {
          setVideoaulas(res.data as VideoAula[])
        })
    }
    if (videoClasse) {
      setComment({ ...comment, videoAula: videoClasse })
    }
  }, [videoClasse])

  useEffect(() => {
    setVideoClasse({ ...videoClasse, comments: comments } as VideoAula)
  }, [comments])

  useEffect(() => {
    if (videoClasse?.idVideoaula) {
      commentApi
        .findAllByIdVideoAula(videoClasse.idVideoaula)
        .then((res) => {
          setComments(res.data as Comment[])
        })
        .catch((error) => {
          console.error('Erro ao carregar comentários:', error)
        })
    }
  }, [videoClasse?.idVideoaula])

  const config: Config = {
    youtube: {
      playerVars: {
        showinfo: 0,
        showRelatedVideos: 0,
        controls: 2,
        rel: 0,
        fs: 1,
      },
    },
  }

  function onChange(ev: { target: { name: any; value: any } }) {
    const { name, value } = ev.target

    setComment({ ...comment, contentComment: value })
  }

  const sentComment = () => {
    const newComments = [...(videoClasse?.comments ?? [])]

    newComments.push(comment)

    setVideoClasse({ ...videoClasse, comments: newComments } as VideoAula)

    setComment({ ...comment, contentComment: '' })

    videoAulaApi
      .update({ ...videoClasse, comments: newComments } as VideoAula)
      .then((res) => setVideoClasse(res.data as VideoAula))
  }

  return (
    <div className={styles.container}>
      <Card
        title={videoClasse?.subject?.nmSubject as string}
        icon={
          <button className={styles.button}>
            {videoClasse?.subject?.imageUrl && (
              <ImageSubjetct
                imageUrl={videoClasse.subject?.imageUrl}
                imageName={videoClasse.subject?.imageName}
                alt={videoClasse.subject?.nmSubject}
              />
            )}
          </button>
        }
        content={'videoClassesTable'}
        buttons={[
          <div key={videoClasse?.idVideoaula}>
            <Link className={styles.menu_navigation} href={`/aluno/home`}>
              {'home / '}
            </Link>
            <Link
              className={styles.menu_navigation}
              href={`/aluno/subject/${videoClasse?.subject?.idSubject}`}
            >
              {videoClasse?.subject?.nmSubject}
            </Link>
            <Link
              className={styles.menu_navigation}
              href={`/aluno/subject/module/${videoClasse?.module?.idModule}`}
            >{` / ${videoClasse?.module?.nmModule}`}</Link>
            <span
              className={styles.menu_navigation}
            >{` / ${videoClasse?.videoTitle}`}</span>
          </div>,
        ]}
      >
        <div className={styles.data_container}>
          <div className={styles.player_container}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoClasse?.videoId}`}
              controls
              width={'100%'}
              height={'100%'}
              config={config}
              className={styles.react_player}
            />
            <span>{videoClasse?.videoTitle}</span>
            <div className={styles.comments_container}>
              <span>Comentários:</span>
              <div className={styles.comment_user}>
                <img
                  key={renderAvatar}
                  src={signedImageUrl ?? defaultImageUserURL}
                  className={styles.img_comment_user}
                  alt={`User avatar`}
                />
                <div className={styles.field_comment_user}>
                  <TextField
                    className={styles.textField}
                    fullWidth
                    style={{ marginRight: '1.5rem' }}
                    type={'text'}
                    id={'contentComment'}
                    name={'contentComment'}
                    label={'Inserir um comentário'}
                    variant={'outlined'}
                    onChange={onChange}
                    value={comment?.contentComment}
                  />
                  <button
                    className={styles.btn_sent_comment}
                    onClick={sentComment}
                  >
                    Comentar
                  </button>
                </div>
              </div>
              <div className={styles.video_classe_comments}>
                {videoClasse &&
                  videoClasse.comments?.map((comment) => (
                    <div key={Math.random()}>
                      <span>{comment.user?.nmUser}: </span>
                      <span>{comment.contentComment}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.playlist_container}>
            <span className={styles.playlist_title}>
              {`${videoClasse?.module?.nmModule}:`}
            </span>
            {videoaulas?.length > 0 &&
              videoaulas?.map((videoaula: VideoAula) => (
                <div
                  key={videoaula.idVideoaula}
                  className={styles.item_playlist}
                >
                  <span className={styles.video_title}>{`${
                    videoaula.videoTitle.length > 38
                      ? videoaula.videoTitle.slice(0, 38).concat('...')
                      : videoaula.videoTitle
                  } - ${videoaula.subject.nmSubject}`}</span>
                  <div className={styles.video_player}>
                    <img
                      className={styles.img}
                      src={videoaula.videoThumbnails}
                      alt={videoaula.videoTitle}
                    />
                    {videoaula.idVideoaula != videoClasse?.idVideoaula && (
                      <div
                        className={styles.modal_player}
                        onClick={() => {
                          Swal.fire({
                            title: 'Carregando...',
                          })
                          Swal.showLoading()
                          router.replace(
                            `/aluno/videoaula/player/${videoaula.idVideoaula}`
                          )
                        }}
                      >
                        <IoPlay size={45} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
