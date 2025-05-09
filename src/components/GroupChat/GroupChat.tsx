import React from "react";
import { RideType } from "../../types";
import styles from "./GroupChat.module.css";

interface GroupChatProps {
  ride: RideType;
}

const GroupChat: React.FC<GroupChatProps> = ({ ride }) => {
  return (
    <div className={styles.container}>
      <div className={styles.rideInfo}>
        <h3>{ride.origin} → {ride.destination}</h3>
        <p className={styles.departureTime}>
          {new Date(ride.departure_time).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default GroupChat;