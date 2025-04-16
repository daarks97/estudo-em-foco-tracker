
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://agrjvocrlriusgkovubm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmp2b2NybHJpdXNna292dWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjQxNDgsImV4cCI6MjA2MDMwMDE0OH0.8D-d_zehVr3jqdelZsuuNrugYCRJo-_lDODnseEL7Qk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
