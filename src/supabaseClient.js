// frontend/radio-station-app/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tavushwilcozyqqugtrt.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdnVzaHdpbGNvenlxcXVndHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTE1NTIsImV4cCI6MjA2MzI2NzU1Mn0.VxrtbYbVW-axrKp2ye_GQmNtka2Z16Eb4Z715GLo5tw'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);