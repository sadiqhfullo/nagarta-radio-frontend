import { supabase } from './supabaseClient'; // update path if needed

// Utility to fetch or create the user's profile
export const getUserRole = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError?.message);
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle(); // safer than .single()

  // If profile does not exist, create it with default values
  if (!data) {
    console.warn('No profile found. Creating default profile...');
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Unknown User',
        email: user.email,
        state: 'Unknown',
        role: 'user',
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('Failed to insert default profile:', insertError.message);
      return null;
    }

    return 'user'; // default role
  }

  if (error) {
    console.error('Error fetching role:', error.message);
    return null;
  }

  return data.role;
};
