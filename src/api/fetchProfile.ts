import supabase from '../helper/supabaseClient';
import { getProfile, createProfile } from './profiles';

export const fetchProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');
  const { data, error } = await getProfile();
  if (error || !data) {
    const defaultProfile = {
      full_name: user.user_metadata.full_name || '',
      bio: '',
      email: user.email,
      photo: "https://fmxpqnwqghkblfdhuqte.supabase.co/storage/v1/object/public/profile-pics//default.png"
    };
    const { error: createError } = await createProfile(defaultProfile);
    if (createError) throw new Error('Error creating profile');
    return defaultProfile;
  }
  return data;
};
