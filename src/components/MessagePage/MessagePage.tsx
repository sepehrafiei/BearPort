import React from 'react'
import styles from './MessagePage.module.css'

interface props {
  id: string | null
}

function MessagePage({id} : props) {
  return (
    <div className={styles.container}>{id}</div>
  )
}

export default MessagePage