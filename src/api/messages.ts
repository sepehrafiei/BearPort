// src/api/messages.ts
import supabase, { requireUser } from '../helper/supabaseClient';
import { Message } from '../types';

// Get messages for a given ride, ordered by creation time.
export const getMessagesByRide = async (rideId: string): Promise<{ data: Message[]; error: Error | null }> => {
  try {
    await requireUser();
    const { data, error } = await supabase.rpc("get_messages_by_ride", { ride_uuid: rideId });
    
    if (error) {
      console.error("Error fetching messages:", error.message);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data as Message[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching messages:", error);
    return { data: [], error: error as Error };
  }
};

// Send a message to a ride. The message is recorded with the authenticated user's id.
export const sendMessage = async (rideId: string, content: string): Promise<{ error: Error | null }> => {
  try {
    await requireUser();
    const { error } = await supabase.rpc("send_message", {
      ride_id: rideId,
      message_content: content,
    });

    if (error) {
      console.error("Error sending message:", error.message);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error sending message:", error);
    return { error: error as Error };
  }
};

