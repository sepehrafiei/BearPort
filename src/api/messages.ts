// src/api/messages.ts
import supabase from '../helper/supabaseClient';

// Get messages for a given room, ordered by creation time.
export const getMessagesByRoom = async (roomId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  return { data, error };
};

// Send a message to a room. The message is recorded with the authenticated user's id.
export const sendMessage = async (roomId: string, content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id: roomId, user_id: user.id, content });
  return { data, error };
};
