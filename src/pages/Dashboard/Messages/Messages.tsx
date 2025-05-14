import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserRides } from "../../../api/rides";
import styles from "./Messages.module.css";
import GroupChat from "../../../components/GroupChat/GroupChat";
import MessagePage from "../../../components/MessagePage/MessagePage";

function Messages() {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [member_id, setMember_id] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch and cache the user's rides
  const { data: ridesResponse, error, isLoading, refetch } = useQuery({
    queryKey: ["userRides"],
    queryFn: async () => {
      const response = await getUserRides();
      if (response.error) throw response.error;
      return response.data || [];
    },
  });

  const handleLeave = () => {
    // Clear the selection immediately
    setSelectedRide(null);
    setMember_id(null);
    
    // Invalidate and refetch the rides list
    queryClient.invalidateQueries({ queryKey: ['userRides'] });
    refetch();
  };

  if (isLoading) return <p className={styles.loading}>Loading chats...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.chatList}>
        {ridesResponse?.map((r) => (
          <div 
            key={r.id} 
            onClick={() => {
              setSelectedRide(r.id)
              setMember_id(r.member_id || "")
            }} 
            className={r.id === selectedRide ? styles.selected : ""}
          >
            <GroupChat ride={r}  />
          </div>
        ))}
      </div>
      <MessagePage 
        rideId={selectedRide} 
        member_id={member_id}
        onLeave={handleLeave}
      />
    </div>
  );
}

export default Messages;
