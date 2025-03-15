import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserRooms } from "../../../api/rooms";
import { RoomType } from "../../../types/index";
import styles from "./Messages.module.css";
import GroupChat from "../../../components/GroupChat/GroupChat";
import MessagePage from "../../../components/MessagePage/MessagePage";

function Messages() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Fetch and cache the user's rooms
  const { data: rooms, error, isLoading } = useQuery({
    queryKey: ["userRooms"],
    queryFn: getUserRooms,
  });

  if (isLoading) return <p className={styles.loading}>Loading chats...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <div className={styles.container}>

        <div className={styles.chatList}>
          {rooms?.map((r) => (
            
            <div 
            key={r.id} 
            onClick={() => setSelectedRoom(r.id)} 
            className={r.id === selectedRoom ? styles.selected : ""}
          >
            <GroupChat room={r} />
          </div>
          
        ))}
        </div>
        <MessagePage id={selectedRoom}/>
    </div>
  );
}

export default Messages;
