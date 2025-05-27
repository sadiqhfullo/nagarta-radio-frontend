import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const StaffDashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from('audio_programs')
        .select('*, comments(*), likes(*)')
        .eq('uploaded_by', userId);

      if (error) console.error(error);
      else setPrograms(data);
    };

    if (userId) fetchPrograms();
  }, [userId]);

  const deleteProgram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    const { error } = await supabase.from('audio_programs').delete().eq('id', id);
    if (!error) {
      setMessage('Program deleted successfully!');
      // Re-fetch programs after deletion
      const { data, error } = await supabase
        .from('audio_programs')
        .select('*, comments(*), likes(*)')
        .eq('uploaded_by', userId);

      if (error) console.error(error);
      else setPrograms(data);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Staff Dashboard</h2>
        <div>
          <a href="/">Home</a>
          <a href="/upload">Upload Program</a>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      </nav>

      {message && <p className="success">{message}</p>}

      <div className="program-list">
        {programs.map((program) => (
          <div key={program.id} className="program-card">
            <h3>{program.title}</h3>
            <audio controls src={program.audio_url}></audio>
            <p>{program.description}</p>
            <p>Likes: {program.likes?.length || 0}</p>
            <p>Comments:</p>
            <ul>
              {program.comments?.map((c) => (
                <li key={c.id}>{c.comment}</li>
              ))}
            </ul>
            <button onClick={() => deleteProgram(program.id)}>Delete</button>
            <a href={`/edit/${program.id}`}>Edit</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
