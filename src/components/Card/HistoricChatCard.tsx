/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from './styles/HistoricChatCard.module.css'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import MessageAPI from '@/resources/api/message'
import { AuthContext } from '@/contexts/AuthContext'
import Message from '@/models/message'
import moment from 'moment'
import RoleEnum from '@/utils/enumerations/role-enum'

interface HistoricChatCardProps {
  contentChat: string
  setContentChat: Dispatch<SetStateAction<string>>
  setIdMessage: Dispatch<SetStateAction<string | undefined>>
}

export default function HistoricChatCard({
  contentChat,
  setContentChat,
  setIdMessage,
}: HistoricChatCardProps) {
  const { user } = useContext(AuthContext)
  const [receivedMessages, setrReceivedMessages] = useState<Message[]>([])
  const [messagesSent, setMessagesSent] = useState<Message[]>([])
  const messageApi = new MessageAPI()

  useEffect(() => {
    if (user) {
      messageApi
        .findAllByIdReceiver(user.idUser as string)
        .then((res) => setrReceivedMessages(res.data as Message[]))
    }
    if (user) {
      messageApi
        .findAllByIdSender(user.idUser as string)
        .then((res) => setMessagesSent(res.data as Message[]))
    }
  }, [user])

  const allMessages = messagesSent.concat(receivedMessages)
  const sortedMessages = [...allMessages].sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )

  return (
    <div className={styles.container}>
      <div className={styles.messages_container}>
        {sortedMessages &&
          sortedMessages.length > 0 &&
          sortedMessages.map((message) => (
            <div
              key={message.idMessage}
              className={styles.message_card}
              onClick={() => {
                setIdMessage(message.idMessage as string)
                setContentChat('contentMessage')
              }}
            >
              <span>{message.receiver.nmUser}</span>
              <span className={styles.msg_nm_subject}>
                {message.subject?.nmSubject ?? message.classe?.nmClasse}
              </span>
              <span className={styles.msg_date}>
                {moment(message.createdDate).format('DD/MM/YYYY HH:mm')}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
