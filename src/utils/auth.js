import { supabase } from '../supabaseClient';

export const getCurrentUser = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) return null;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  return user;
};

// Fetch role from Supabase profiles table
export const getUserRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  // Store in localStorage for session persistence
  localStorage.setItem('userRole', data.role);
  return data.role;
};

// Optional helper
export const isLoggedIn = async () => {
  const user = await getCurrentUser();
  return !!user;
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('userRole');
};
