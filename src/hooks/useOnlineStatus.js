// src/hooks/useOnlineStatus.js

import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useOnlineStatus = () => {
  useEffect(() => {
    const updateStatus = async (status) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error fetching user:', userError.message);
          return;
        }

        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ status })
            .eq('id', user.id);

          if (error) {
            console.error(`Failed to set status to "${status}":`, error.message);
          } else {
            console.log(`Status updated to "${status}" for user ${user.id}`);
          }
        }
      } catch (err) {
        console.error('Unexpected error setting online status:', err);
      }
    };

    // Set status to online when component mounts
    updateStatus('online');

    // Handle status updates on page/tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateStatus('offline');
      } else if (document.visibilityState === 'visible') {
        updateStatus('online');
      }
    };

    // Handle browser/tab unload (refresh or close)
    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    // Add listeners
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function when component unmounts
    return () => {
      updateStatus('offline');
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
