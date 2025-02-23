// src/api/rooms.ts
import supabase from '../helper/supabaseClient';

// Retrieve a list of all rooms, ordered by departure time.
export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('departure_time', { ascending: true });
  return { data, error };
};

// Create a new room. The host_id is automatically set to the authenticated user.
export const createRoom = async (roomData: any) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const newRoom = { ...roomData, host_id: user.id };
  const { data, error } = await supabase
    .from('rooms')
    .insert(newRoom)
    .single();
  return { data, error };
};

// Join a room by adding an entry to the room_members table.
export const joinRoom = async (roomId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('room_members')
    .insert({ room_id: roomId, user_id: user.id });
  return { data, error };
};

// Leave a room by deleting the membership record.
export const leaveRoom = async (roomId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('room_members')
    .delete()
    .match({ room_id: roomId, user_id: user.id });
  return { data, error };
};
