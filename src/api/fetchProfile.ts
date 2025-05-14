import supabase from '../helper/supabaseClient';
import {createProfile } from './profiles';

export const fetchProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  // First try to get existing profile
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // If no profile exists, create one
  const baseUsername = user.user_metadata.full_name
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15) || '';

  // Add random number to ensure uniqueness
  const username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;

  const defaultProfile = {
    full_name: user.user_metadata.full_name || '',
    bio: '',
    email: user.email,
    photo: "https://fmxpqnwqghkblfdhuqte.supabase.co/storage/v1/object/public/profile-pics//default.png",
    username: username
  };

  try {
    const { error: createError, data: newProfile } = await createProfile(defaultProfile);
    if (createError) {
      console.error('Error creating profile:', createError);
      throw new Error('Error creating profile: ' + createError.message);
    }
    return newProfile;
  } catch (err) {
    console.error('Profile creation failed:', err);
    // If creation failed due to duplicate, try to fetch the existing profile again
    const { data: retryProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (retryProfile) {
      return retryProfile;
    }
    
    throw new Error('Failed to create or fetch profile. Please try again later.');
  }
};
