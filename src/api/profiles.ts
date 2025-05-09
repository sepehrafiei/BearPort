// src/api/profiles.ts
import supabase from '../helper/supabaseClient';
import { ProfileType } from '../types';

// Get the profile for the currently authenticated user.
export const getProfile = async (): Promise<{ data: ProfileType | null; error: Error | null }> => {
  try {
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
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Update the profile for the currently authenticated user.
export const updateProfile = async (profileData: Partial<ProfileType>): Promise<{ data: ProfileType | null; error: Error | null }> => {
  try {
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
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Generate a unique username from email or name
const generateUsername = async (email: string, fullName: string): Promise<string> => {
  // Try using email first (remove domain and special characters)
  const emailBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Try using name if email is too short
  const nameBase = fullName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  
  // Use whichever is longer, or combine them if both are short
  const base = emailBase.length > nameBase.length ? emailBase : nameBase;
  
  // Try the base username first
  const isBaseAvailable = await isUsernameAvailable(base);
  if (isBaseAvailable) {
    return base;
  }

  // If base is taken, try adding random letters until we find an available one
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate 3 random letters
    const randomLetters = Array.from({ length: 3 }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    ).join('');
    
    const username = `${base}${randomLetters}`;
    
    if (await isUsernameAvailable(username)) {
      return username;
    }
    
    attempts++;
  }

  // If we still haven't found a username, add a timestamp
  const timestamp = Date.now().toString().slice(-4);
  return `${base}${timestamp}`;
};

// Validate username format
const validateUsername = (username: string): boolean => {
  // Username rules:
  // - 3-20 characters
  // - Only letters, numbers, and underscores
  // - Must start with a letter
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
  return usernameRegex.test(username);
};

// Check if username is available
const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();
  
  return !data;
};

// Modify the createProfile function to include username generation
export const createProfile = async (profileData: Omit<ProfileType, 'id' | 'email' | 'photo'>): Promise<{ data: ProfileType | null; error: Error | null }> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return { data: existingProfile, error: null };
    }

    // Generate a unique username using both email and name
    const username = await generateUsername(user.email || '', profileData.full_name);

    const newProfile: ProfileType = {
      ...profileData,
      id: user.id,
      email: user.email || '',
      photo: "https://fmxpqnwqghkblfdhuqte.supabase.co/storage/v1/object/public/profile-pics//default.png",
      username: username
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();
    
    if (error) {
      if (error.message?.includes('duplicate')) {
        const { data: retryProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (retryProfile) {
          return { data: retryProfile, error: null };
        }
      }
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Add a function to update username
export const updateUsername = async (newUsername: string): Promise<{ data: ProfileType | null; error: Error | null }> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Validate username format
    if (!validateUsername(newUsername)) {
      throw new Error('Invalid username format. Username must be 3-20 characters, start with a letter, and contain only letters, numbers, and underscores.');
    }

    // Check if username is available
    const isAvailable = await isUsernameAvailable(newUsername);
    if (!isAvailable) {
      throw new Error('This username is already taken. Please choose a different one.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export interface Profile {
  full_name: string;
  bio: string | null;
  rating: number | null;
  photo: string | null;
  instagram: string | null;
  created_at: string;
}

export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  console.log('Fetching profile for username:', username);
  
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  console.log('Found profile:', data);
  return data;
};

export const updateProfileByUsername = async (username: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('username', username)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
};
