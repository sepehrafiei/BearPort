import styles from './Ride.module.css'
import { RideType } from '../../types'
import Airplane from '../../assets/airplane.png'
import Clock from '../../assets/clock.png'
import Cap from '../../assets/user-account.png'

interface props {
    ride: RideType,
    handleJoinRide: (rideId: string)=>void
}

function Ride({ride, handleJoinRide} : props) {


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
            <p><strong>{ride.origin}</strong></p>
            <img src={Airplane} alt="" />
            <p><strong>{ride.destination}</strong></p>
        </div>
        <img className={styles.pfp} src={ride.host_photo || ""} />
        <p>Host: {ride.host_name}</p>
        
        <div className={styles.details}>
          <p><img className = {styles.clock} src={Clock} alt="Departure Time: " /> {new Intl.DateTimeFormat("en-US", options).format(new Date(ride.departure_time))}</p>
          <p><img className = {styles.cap} src={Cap} alt="" />Capacity:{ride.count_members}/{ride.capacity}</p>
        </div>
        <button className={ride.joined || ride.count_members == ride.capacity ? styles.joined : styles.notJoined} disabled={(ride.joined || ride.capacity == ride.count_members) || false} onClick={()=>handleJoinRide(ride.id)}>{ride.joined ? "Already Joined" : ride.capacity == ride.count_members ? "Full Ride" : "Join Ride"}</button>
    </div>
  )
}

export default Ride