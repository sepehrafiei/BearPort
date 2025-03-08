// src/api/profiles.ts
import supabase from '../helper/supabaseClient';

// Get the profile for the currently authenticated user.
export const getProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return { data, error };
};

// Update the profile for the currently authenticated user.
export const updateProfile = async (profileData: any) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Do not allow updating the id – use the session's user id.
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);
  return { data, error };
};

// Optionally, create a new profile for a user on first login.
export const createProfile = async (profileData: any) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const newProfile = { ...profileData, id: user.id, email: user.email, photo: "https://fmxpqnwqghkblfdhuqte.supabase.co/storage/v1/object/public/profile-pics//default.png"};
  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .single();
  return { data, error };
};
