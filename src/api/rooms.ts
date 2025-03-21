// src/api/rooms.ts
import supabase, {requireUser} from '../helper/supabaseClient';
import { RideType } from '../types';



export async function fetchPaginatedRides(page: number, pageSize: number): Promise<RideType[]> {
  await requireUser();
  const safePage = Math.max(page, 1);
  const { data, error } = await supabase.rpc("get_available_rides", {
    page_offset: (safePage - 1) * pageSize,
    page_limit: pageSize,
  });
  if (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
  return data as RideType[];
}



export const getUserRides = async (): Promise<RideType[]> => {
  await requireUser();
  const { data, error } = await supabase.rpc('get_user_rides');
  if (error) throw new Error(error.message);
  return data as RideType[];
};


export const addRide = async (rideData: Partial<RideType>) => {
  await requireUser();
  const { data, error } = await supabase.rpc('add_ride', rideData);
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Ride creation failed, no ride ID returned');
  await joinRide(data);
  return data;
};

export const joinRide = async (roomId: string) => {
  await requireUser();
  const { error } = await supabase.rpc('join_ride', { ride_id: roomId });
  if (error) throw new Error(error.message);
};
