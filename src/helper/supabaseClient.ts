import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

export async function requireUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
  
    if (error || !user) {
      throw new Error('User not authenticated');
    }
  
    return user;
  }