// src/api/rooms.ts
import supabase, { requireUser } from '../helper/supabaseClient';
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

export const getRide = async (rideId: string): Promise<RideType> => {
  await requireUser();
  const { data, error } = await supabase.rpc('get_ride', { ride_id: rideId });
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Ride not found');
  return data[0] as RideType;
};


export const addRide = async (rideData: Partial<RideType>) => {
  await requireUser();
  const { data: rideId, error } = await supabase.rpc('create_ride', rideData);
  if (error) throw new Error(error.message);
  if (!rideId) throw new Error('Ride creation failed');

  await joinRide(rideId); // auto join the host
  const newRide = await getRide(rideId);
  return { data: newRide };
};

export const joinRide = async (rideId: string) => {
  await requireUser();
  const { error } = await supabase.rpc('join_ride', { ride_id: rideId });
  if (error) throw new Error(error.message);
};
