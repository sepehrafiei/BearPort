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
            <p><strong>{room.origin} → {room.destination}</strong></p>
        </div>
        <img className={styles.pfp} src={room.host_photo || ""} />
        <p><strong>Host:</strong>{room.host_name}</p>
        
        <p><strong>Departure Date:</strong> {room.departure_date}</p>
        <p><strong>Departure Time:</strong> {room.departure_time}</p>
        <p><strong>Capacity:</strong>{room.count_members}/{room.capacity}</p>
        <button className={room.joined || room.count_members == room.capacity ? styles.joined : styles.notJoined} disabled={(room.joined || room.capacity == room.count_members) || false} onClick={()=>handleJoinRoom(room.id)}>{room.joined ? "Already Joined" : room.capacity == room.count_members ? "Full Room" : "Join Room"}</button>
    </div>
  )
}

export default Room