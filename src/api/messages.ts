// src/api/messages.ts
import supabase from '../helper/supabaseClient';

// Get messages for a given room, ordered by creation time.
export const getMessagesByRoom = async (roomId: string) => {
  const { data, error } = await supabase.rpc("get_messages_by_room", { room_uuid: roomId });

  if (error) {
    console.error("Error fetching messages:", error.message);
    return { data: [], error };
  }

  return { data, error };
};


// Send a message to a room. The message is recorded with the authenticated user's id.
export const sendMessage = async (roomId: string, content: string) => {
  const { error } = await supabase.rpc("send_message", {
    room_id: roomId,
    message_content: content,
  });

  if (error) {
    console.error("Error sending message:", error.message);
  }
};

