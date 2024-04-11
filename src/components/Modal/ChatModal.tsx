/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import HistoricChatCard from '../Card/HistoricChatCard'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { LuMessageSquarePlus } from 'react-icons/lu'
import styles from './styles/ChatModal.module.css'
import { MdOutlineHistory } from 'react-icons/md'
import MessageAPI from '@/resources/api/message'
import { ChatForm } from '../Form/ChatForm'
import Message from '@/models/message'
import { NewChatForm } from '../Form/NewChatForm'
import RoleEnum from '@/utils/enumerations/role-enum'

interface ChatModalProps {}

export default function ChatModal({}: ChatModalProps) {
  const { user, contentChat, setContentChat } = useContext(AuthContext)
  const [message, setMessage] = useState<Message>()
  const [idMessage, setIdMessage] = useState<string>()
  const messageApi = new MessageAPI()

  useEffect(() => {
    if (idMessage) {
      messageApi
        .findById(idMessage)
        .then((res) => setMessage(res.data as Message))
    }
  }, [idMessage])
  return (
    <div className={styles.container}>
      <div className={styles.btns_container}>
        <button
          className={styles.btn}
          onClick={() => setContentChat('newMessage')}
        >
          <LuMessageSquarePlus />
          Nova Mensagem
        </button>
        <button
          className={styles.btn}
          onClick={() => setContentChat('historicMessage')}
        >
          <MdOutlineHistory />
          Histórico
        </button>
      </div>
      <div className={styles.chat_container}>
        {contentChat === 'newMessage' && (
          <NewChatForm
            setMessage={setMessage}
            setContentChat={setContentChat}
          />
        )}
        {contentChat === 'contentMessage' && (
          <ChatForm message={message} setMessage={setMessage} />
        )}
        {contentChat === 'historicMessage' && (
          <HistoricChatCard
            contentChat={contentChat}
            setContentChat={setContentChat}
            setIdMessage={setIdMessage}
          />
        )}
      </div>
    </div>
  )
}
