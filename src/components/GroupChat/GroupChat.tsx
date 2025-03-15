import React from 'react'
import styles from './GroupChat.module.css'
import { RoomType } from '../../types'

interface props{
    room: RoomType
}

function GroupChat({room} : props) {
  return (
    <div className={styles.container}>
        <img src={room.host_photo || ""}  className={styles.pfp} />
            <div>
              <p className={styles.chatName}>{room.origin} → {room.destination}</p>
              <p className={styles.hostName}>Host: {room.host_name}</p>
            </div>
    </div>
  )
}

export default GroupChat