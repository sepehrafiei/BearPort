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
  profile_pic: string ;
  rating?: number | null;
  social_media?: SocialMedia | null;
}
