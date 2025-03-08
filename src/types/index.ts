export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

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
