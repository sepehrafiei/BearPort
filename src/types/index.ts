export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface Profile {
  id?: string;
  full_name: string;
  bio: string;
  email?: string;
  created_at?: string;
  profile_pic?: string | null;
  rating?: number | null;
  social_media?: SocialMedia | null;
}
