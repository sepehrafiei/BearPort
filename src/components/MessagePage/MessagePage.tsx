import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./MessagePage.module.css";
import supabase from "../../helper/supabaseClient";
import { sendMessage, getMessagesByRide } from "../../api/messages";
import { Message } from "../../types/index";

interface Props {
  rideId: string | null;
  member_id: string | null;
}

function MessagePage({ rideId, member_id }: Props) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  // Fetch and cache messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", rideId],
    queryFn: async () => {
      if (!rideId) return [];
      const { data, error } = await getMessagesByRide(rideId);
      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
      return data;
    },
    enabled: !!rideId, // Only run if roomId is present
    staleTime: Infinity, // Cache messages indefinitely
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      if (!rideId) return;
      return sendMessage(rideId, newMessage);
    },
    onSuccess: () => {
      setMessage(""); // Clear input after sending
    },
  });

  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel(`room-${rideId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `ride_id=eq.${rideId}` },
        (payload) => {
          const newMessage = payload.new as Message;

          // Update cache only if the message is new
          queryClient.setQueryData(["messages", rideId], (oldMessages: Message[] = []) => {
            if (!oldMessages.some((msg) => msg.id === newMessage.id)) {
              return [...oldMessages, newMessage];
            }
            return oldMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, queryClient]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return rideId ? (
    <div className={styles.container}>
      <div className={styles.messages}>
        {isLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg : any) => (
            <div key={msg.id} className={styles.message}>
              <strong>{msg.member_id === member_id ? "You" : msg.sender_name}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>
      <div className={styles.inputContainer}>
        <input
          className= {styles.input}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className={styles.send_btn} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.noChat}>Select a chat to start messaging</div>
  );
}

export default MessagePage;
