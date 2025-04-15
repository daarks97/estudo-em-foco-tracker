
import { createClient } from '@supabase/supabase-js';

// Hardcoded values for development
// In production, these should be environment variables
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
