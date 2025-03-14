import React from 'react'
import styles from './Room.module.css'
import { RoomType } from '../../types'

interface props {
    room: RoomType,
    handleJoinRoom: (roomId: string)=>void
}

function Room({room, handleJoinRoom} : props) {
  return (
    <div className={styles.container}>
        <div className={styles.head}>
            <p><strong>{room.origin} ------------------ {room.destination}</strong></p>
        </div>
        <p><strong>Host:</strong>{room.host_name}</p>
        
        <p><strong>Departure Date:</strong> {room.departure_date}</p>
        <p><strong>Departure Time:</strong> {room.departure_time}</p>
        <p><strong>Capacity:</strong>{room.count_members}/{room.capacity}</p>
        <button className={room.joined ? styles.joined : styles.notJoined} disabled={room.joined} onClick={()=>handleJoinRoom(room.id)}>{room.joined ? "Already Joined" : "Join Room"}</button>
    </div>
  )
}

export default Room