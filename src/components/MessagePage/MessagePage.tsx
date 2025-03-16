import React, { useState, useEffect } from "react";
import styles from "./MessagePage.module.css";
import supabase from "../../helper/supabaseClient";
import { sendMessage, getMessagesByRoom } from "../../api/messages";

interface Props {
  roomId: string | null;
}

interface Message {
  id: string;
  room_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

function MessagePage({ roomId }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages when roomId changes
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data, error } = await getMessagesByRoom(roomId); // ✅ Using SQL function

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
        console.log(data);
      }
    };

    fetchMessages();

    // Listen for new messages in real-time
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          // Fetch the updated messages after an insert event
          const { data: newMessages, error } = await getMessagesByRoom(roomId);

          if (!error) {
            setMessages(newMessages);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Cleanup on unmount
    };
  }, [roomId]);


  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    await sendMessage(roomId!, message);
    setMessage(""); // Clear input after sending
  };

  return roomId ? (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <strong>{msg.sender_name}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  ) : (
    <div className={styles.noChat}>Select a chat to start messaging</div>
  );
}

export default MessagePage;
