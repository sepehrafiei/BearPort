import React from 'react'
import styles from './GroupChat.module.css'
import { RideType } from '../../types'

interface props{
    ride: RideType
}

function GroupChat({ride} : props) {
  return (
    <div className={styles.container}>
        <img src={ride.host_photo || ""}  className={styles.pfp} />
            <div>
              <p className={styles.chatName}>{ride.origin} → {ride.destination}</p>
              <p className={styles.hostName}>Host: {ride.host_name}</p>
            </div>
    </div>
  )
}

export default GroupChat