import styles from './Room.module.css'
import { RideType } from '../../types'
import Airplane from '../../assets/airplane.png'
import Clock from '../../assets/clock.png'
import Cap from '../../assets/user-account.png'

interface props {
    room: RideType,
    handleJoinRoom: (roomId: string)=>void
}

function Room({room, handleJoinRoom} : props) {


  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };





  return (
    <div className={styles.container}>
        <div className={styles.head}>
            <p><strong>{room.origin}</strong></p>
            <img src={Airplane} alt="" />
            <p><strong>{room.destination}</strong></p>
        </div>
        <img className={styles.pfp} src={room.host_photo || ""} />
        <p>Host: {room.host_name}</p>
        
        <div className={styles.details}>
          <p><img className = {styles.clock} src={Clock} alt="Departure Time: " /> {new Intl.DateTimeFormat("en-US", options).format(new Date(room.departure_time))}</p>
          <p><img className = {styles.cap} src={Cap} alt="" />Capacity:{room.count_members}/{room.capacity}</p>
        </div>
        <button className={room.joined || room.count_members == room.capacity ? styles.joined : styles.notJoined} disabled={(room.joined || room.capacity == room.count_members) || false} onClick={()=>handleJoinRoom(room.id)}>{room.joined ? "Already Joined" : room.capacity == room.count_members ? "Full Room" : "Join Room"}</button>
    </div>
  )
}

export default Room