// src/api/rooms.ts
import supabase from '../helper/supabaseClient';
import {v4 as uuidv4} from 'uuid';
import { RoomType } from '../types';



export async function fetchPaginatedRooms(page: number, pageSize: number) {
  console.log(page);
  console.log(pageSize);
  const { data, error } = await supabase
    .rpc("get_paginated_rooms", {
      page_offset: (page - 1) * pageSize,
      page_limit: pageSize,
    });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }

  return data as RoomType[];
}


export const getUserRooms = async (): Promise<RoomType[]> => {
  const { data, error } = await supabase.rpc("get_user_rooms");

  if (error) throw new Error(error.message);
  return data as RoomType[];
};

// Create a new room. The host_id is automatically set to the authenticated user.
export const createRoom = async (roomData: any) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const roomId = uuidv4();
  const newRoom = { ...roomData, host_id: user.id, id: roomId };
  const { data, error } = await supabase
    .from('rooms')
    .insert(newRoom)
    .single();
  let er = await joinRoom(roomId);
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
