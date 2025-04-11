export interface ProfileType {
  id?: string;
  full_name: string;
  bio: string;
  email?: string;
  created_at?: string;
  photo: string ;
  rating?: number | null;
  instagram?: string | null;
}

export interface RideType {
  id: string;
  host_name?: string | null;
  host_photo?: string | null;
  origin: string;
  destination: string;
  departure_time: string;
  capacity: number;
  count_members?: number | null;
  joined?: boolean | null;
  member_id?: string | null;
}



export interface Message {
  id: string;
  room_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  member_id: string;
}