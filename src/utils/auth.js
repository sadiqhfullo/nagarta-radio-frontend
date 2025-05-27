// src/utils/auth.js
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getCurrentUser = () => auth.currentUser;

export const getUserRole = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      return profileSnap.data().role.toLowerCase();
    }
    return null;
  } catch (err) {
    console.error('Error fetching role:', err.message);
    return null;
  }
};
