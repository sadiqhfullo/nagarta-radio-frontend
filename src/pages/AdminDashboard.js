// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState({ title: '', description: '', audio_url: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase.from('programs').select('*');
    if (!error) setPrograms(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (!error) {
      setSuccessMessage('Program deleted successfully.');
      fetchPrograms();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('programs').insert([newProgram]);
    if (!error) {
      setSuccessMessage('Program uploaded successfully.');
      setNewProgram({ title: '', description: '', audio_url: '' });
      fetchPrograms();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Nagarta Admin Dashboard</h2>
        <div>
          <button onClick={() => navigate('/')} className="nav-btn">Go to Home</button>
          <button onClick={logout} className="nav-btn">Logout</button>
        </div>
      </nav>

      <div className="upload-form">
        <h3>Upload New Program</h3>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Title"
            value={newProgram.title}
            onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newProgram.description}
            onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
            required
          ></textarea>
          <input
            type="url"
            placeholder="Audio URL"
            value={newProgram.audio_url}
            onChange={(e) => setNewProgram({ ...newProgram, audio_url: e.target.value })}
            required
          />
          <button type="submit">Upload</button>
        </form>
        {successMessage && <p className="success-msg">{successMessage}</p>}
      </div>

      <div className="programs-section">
        <h3>All Uploaded Programs</h3>
        {programs.map(program => (
          <div key={program.id} className="program-card">
            <h4>{program.title}</h4>
            <p>{program.description}</p>
            <audio controls src={program.audio_url}></audio>
            <p><strong>Likes:</strong> {program.likes || 0}</p>
            <p><strong>Comments:</strong></p>
            <ul>
              {(program.comments || []).map((comment, idx) => <li key={idx}>{comment}</li>)}
            </ul>
            <button onClick={() => handleDelete(program.id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
