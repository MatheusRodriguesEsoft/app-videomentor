/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Grid, TextField } from '@mui/material'
import { ActionsContext } from '@/contexts/ActionsContext'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './styles/ChatForm.module.css'
import Swal from 'sweetalert2'
import { Form } from './Form'
import { AuthContext } from '@/contexts/AuthContext'
import Message from '@/models/message'
import MessageAPI from '@/resources/api/message'
import User from '@/models/user'
import moment from 'moment'
import ContentMessageAPI from '@/resources/api/content-message'
import ContentMessage from '@/models/content-message'
import StatusContentMessageEnum from '@/utils/enumerations/status-content-message-enum'
import { LuCheck, LuCheckCheck } from 'react-icons/lu'

interface ChatFormProps {
  message: Message | undefined
  setMessage: Dispatch<SetStateAction<Message | undefined>>
}

export function ChatForm({ message, setMessage }: ChatFormProps) {
  const { setContent } = useContext(ActionsContext)
  const { user } = useContext(AuthContext)
  const contentMessageApi = new ContentMessageAPI()
  const messageApi = new MessageAPI()
  const [values, setValues] = useState<ContentMessage>({
    statusMessage: StatusContentMessageEnum.SENT,
  } as unknown as ContentMessage)

  const chatBoxRef = useRef<HTMLDivElement>(null)

  const updateContentMessage = (contentMessage: ContentMessage) => {
    contentMessageApi
      .update(contentMessage)
      .then((res) => console.log(res.data))
  }

  useEffect(() => {
    setTimeout(() => {
      Swal.close()
    }, 300)
  }, [])

  const getMsgError = (err: string) => {
    Swal.fire({
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Ok',
      title: 'Ocorreu um erro',
      text: 'falha ao carregar os dados',
      icon: 'error',
    })
  }

  function loadData() {}

  useEffect(() => loadData(), [])

  useEffect(() => {
    // Se houver uma referência à div chat_box, ajuste a rolagem para a parte inferior
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
    message?.contentMessages.forEach(contentMessage => {
      if(contentMessage.user.idUser !== user?.idUser && contentMessage.statusMessage === StatusContentMessageEnum.RECEIVED){
        updateContentMessage({
          ...contentMessage,
          statusMessage: StatusContentMessageEnum.VIEWED,
        })
      }
    })


  }, [message])

  const handleChangeMessage = (ev: {
    target: { name: any; value: string }
  }) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      content: ev.target.value,
      user: user,
      date: Date.now(),
      message: message,
    }))
  }

  function send(values: ContentMessage) {
    //criar um ContentMessage
    contentMessageApi
      .save(values as ContentMessage)
      .then((res) => {
        messageApi
          .findById(message?.idMessage)
          .then((res) => setMessage(res.data))
      })
      .catch((err) => {
        Swal.fire({
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Ok',
          text: 'Falha ao registrar videoaula',
          icon: 'error',
        })
      })
      .finally(() => {
        setValues({ ...values, content: '' })
      })

    // messageApi
    //   .save(message)
    //   .then(() => {
    //     Swal.fire({
    //       showConfirmButton: true,
    //       showCancelButton: false,
    //       text: 'Mensagem enviada com sucesso',
    //       icon: 'success',
    //     }).then(() => setContent('update'))
    //   })
    //   .catch((err) => {
    //     Swal.fire({
    //       showConfirmButton: false,
    //       showCancelButton: true,
    //       cancelButtonText: 'Ok',
    //       text: 'Falha ao registrar videoaula',
    //       icon: 'error',
    //     })
    //   })
    //   .finally()
  }

  function onSubmit(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    send(values as ContentMessage)
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.video_data}>
          <Form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={styles.chat_box} ref={chatBoxRef}>
                  {message &&
                    message.contentMessages?.map((contentMessage) =>
                      contentMessage.user.idUser === user?.idUser ? (
                        <div
                          key={Math.random()}
                          className={`${styles.msn_card} ${styles.sender_card}`}
                        >
                          <span className={styles.nm_user}>
                            {contentMessage.user.nmUser}
                          </span>
                          <span className={styles.msn_user}>
                            {contentMessage.content}
                          </span>
                          <span className={styles.msn_date}>
                            {moment(contentMessage.date).format('HH:mm A')}
                            {contentMessage.statusMessage ===
                              StatusContentMessageEnum.SENT && <LuCheck />}
                            {contentMessage.statusMessage ===
                              StatusContentMessageEnum.RECEIVED && (
                              <LuCheckCheck />
                            )}
                            {contentMessage.statusMessage ===
                              StatusContentMessageEnum.VIEWED && (
                              <LuCheckCheck color={'var(--theme-color)'} />
                            )}
                          </span>
                        </div>
                      ) : (
                        <div
                          key={Math.random()}
                          className={`${styles.msn_card} ${styles.receiver_card}`}
                        >
                          <span className={styles.nm_user}>
                            {contentMessage.user?.nmUser}
                          </span>
                          <span className={styles.msn_user}>
                            {contentMessage.content}
                          </span>
                          <span className={styles.msn_date}>
                            {moment(contentMessage.date).format('HH:mm A')}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  value={values?.content}
                  fullWidth
                  required
                  name={'contentMessage'}
                  label={'Mensagem'}
                  multiline
                  rows={2}
                  maxRows={30}
                  onChange={handleChangeMessage}
                />
              </Grid>
              <Grid item xs={12} className={styles.btn_actions_container}>
                <button
                  type={'submit'}
                  className={`${styles.btn} ${styles.btn_send}`}
                >
                  Enviar
                </button>
              </Grid>
            </Grid>
          </Form>
        </div>
      </div>
    </div>
  )
}
