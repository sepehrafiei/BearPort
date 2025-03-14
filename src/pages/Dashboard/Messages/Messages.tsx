import React from 'react'
import styles from './Messages.module.css'
import ChatList from '../../../components/ChatList/ChatList'
import MessagePage from '../../../components/MessagePage/MessagePage'

function Messages() {
  return (
    <div className={styles.container}>
      <ChatList/>
      <MessagePage/>
    </div>
  )
}

export default Messages