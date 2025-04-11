// src/api/messages.ts
import supabase, {requireUser} from '../helper/supabaseClient';

// Get messages for a given room, ordered by creation time.
export const getMessagesByRide = async (rideId: string) => {
  await requireUser();
  const { data, error } = await supabase.rpc("get_messages_by_ride", { ride_uuid: rideId });
  if (error) {
    console.error("Error fetching messages:", error.message);
    return { data: [], error };
  }

  return { data, error };
};


// Send a message to a room. The message is recorded with the authenticated user's id.
export const sendMessage = async (rideId: string, content: string) => {
  await requireUser();
  const { error } = await supabase.rpc("send_message", {
    ride_id: rideId,
    message_content: content,
  });

  if (error) {
    console.error("Error sending message:", error.message);
  }
};

