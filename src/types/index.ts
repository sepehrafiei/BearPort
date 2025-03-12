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

export interface RoomType {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  capacity: number;
  departure_date: string;
  profiles: {
    full_name: string;
}[];
}
