import { supabase } from '../supabaseClient';

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
    .maybeSingle();

  if (error) {
    console.error('Error fetching role:', error.message);
    return null;
  }

  // If no profile exists, insert default and return 'user'
  if (!data) {
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

    return 'user';
  }

  // ✅ Normalize role to lowercase
  return data.role.toLowerCase();
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Error fetching user:', error?.message);
    return null;
  }

  return user;
};
