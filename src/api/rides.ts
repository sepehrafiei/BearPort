// src/api/rides.ts
import supabase, { requireUser } from '../helper/supabaseClient';
import { RideType } from '../types';

// export async function fetchPaginatedRides(page: number, pageSize: number): Promise<RideType[]> {
//   await requireUser();
//   const safePage = Math.max(page, 1);
//   const { data, error } = await supabase.rpc("get_available_rides", {
//     page_offset: (safePage - 1) * pageSize,
//     page_limit: pageSize,
//   });
//   if (error) {
//     console.error("Error fetching rides:", error);
//     throw error;
//   }
//   return data as RideType[];
// }

interface RideFilters {
  origin: string | null;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export async function fetchPaginatedRides(
  page: number,
  pageSize: number,
  filters: RideFilters
): Promise<ApiResponse<RideType[]>> {
  try {
    await requireUser();
    const safePage = Math.max(page, 1);

    const { data, error } = await supabase.rpc('get_available_rides_with_filters', {
      origin_param: filters.origin,
      destination_param: filters.destination,
      start_date_param: filters.startDate,
      end_date_param: filters.endDate,
      page_limit: pageSize,
      page_offset: (safePage - 1) * pageSize,
    });

    if (error) {
      console.error("Error fetching filtered rides:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RideType[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching rides:", error);
    return { data: null, error: error as Error };
  }
}

export const getUserRides = async (): Promise<ApiResponse<RideType[]>> => {
  try {
    await requireUser();
    const { data, error } = await supabase.rpc('get_user_rides');
    
    if (error) {
      console.error("Error fetching user rides:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RideType[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching user rides:", error);
    return { data: null, error: error as Error };
  }
};

export const getRide = async (rideId: string): Promise<ApiResponse<RideType>> => {
  try {
    await requireUser();
    const { data, error } = await supabase.rpc('get_ride', { ride_id: rideId });
    
    if (error) {
      console.error("Error fetching ride:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: new Error('Ride not found') };
    }

    return { data: data[0] as RideType, error: null };
  } catch (error) {
    console.error("Unexpected error fetching ride:", error);
    return { data: null, error: error as Error };
  }
};

export const addRide = async (rideData: Partial<RideType>): Promise<ApiResponse<RideType>> => {
  try {
    await requireUser();
    const { data: rideId, error } = await supabase.rpc('create_ride', rideData);
    
    if (error) {
      console.error("Error creating ride:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    if (!rideId) {
      return { data: null, error: new Error('Ride creation failed') };
    }

    await joinRide(rideId); // auto join the host
    const newRide = await getRide(rideId);
    return newRide;
  } catch (error) {
    console.error("Unexpected error creating ride:", error);
    return { data: null, error: error as Error };
  }
};

export const joinRide = async (rideId: string): Promise<ApiResponse<void>> => {
  try {
    await requireUser();
    const { error } = await supabase.rpc('join_ride', { ride_id: rideId });
    
    if (error) {
      console.error("Error joining ride:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: undefined, error: null };
  } catch (error) {
    console.error("Unexpected error joining ride:", error);
    return { data: null, error: error as Error };
  }
};

export const leaveRide = async (rideId: string): Promise<ApiResponse<void>> => {
  try {
    await requireUser();
    const { error } = await supabase.rpc('leave_ride', { ride_id: rideId });
    
    if (error) {
      console.error("Error leaving ride:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: undefined, error: null };
  } catch (error) {
    console.error("Unexpected error leaving ride:", error);
    return { data: null, error: error as Error };
  }
};

export const deleteRide = async (rideId: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase.rpc('delete_ride', {
      ride_id: rideId
    });

    if (error) throw error;

    return { data: undefined, error: null };
  } catch (error) {
    console.error('Error deleting ride:', error);
    return { data: undefined, error: error as Error };
  }
};

export const isRideHost = async (rideId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { data, error } = await supabase.rpc('is_ride_host', {
      ride_id: rideId
    });

    if (error) throw error;

    return { data: data as boolean, error: null };
  } catch (error) {
    console.error('Error checking ride host:', error);
    return { data: null, error: error as Error };
  }
};

export interface RideMember {
  id: string;
  name: string;
  photo_url?: string;
  is_host: boolean;
  username: string;
}

export const getRideMembers = async (rideId: string): Promise<ApiResponse<RideMember[]>> => {
  try {
    await requireUser();
    const { data, error } = await supabase.rpc('get_ride_members', { ride_id: rideId });
    
    if (error) {
      console.error("Error fetching ride members:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RideMember[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching ride members:", error);
    return { data: null, error: error as Error };
  }
};
