import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';

const ManagePrograms = () => {
  const [session, setSession] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fileInputRef = useRef(null);

  const PROGRAMS_PER_PAGE = 10;

  // Load session
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Error fetching session:', error);
      else setSession(data.session);
    };

    getSession();
  }, []);

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !session?.user || !title.trim()) {
      alert('Please provide a title, select a file, and ensure you are logged in.');
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('programs')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('programs')
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('Failed to retrieve public URL');

      // Insert program record
      const { error: insertError } = await supabase
        .from('programs')
        .insert([
          {
            title: title.trim(),
            url: publicUrl,
            uploaded_by: session.user.id,
          },
        ]);

      if (insertError) {
        throw new Error(`Insert failed: ${insertError.message}`);
      }

      alert('Upload successful!');
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadPrograms(); // Refresh program list
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong during upload.');
    } finally {
      setLoading(false);
    }
  };

  // Load programs
  const loadPrograms = useCallback(async () => {
    if (!session?.user) return;

    const from = (page - 1) * PROGRAMS_PER_PAGE;
    const to = from + PROGRAMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('programs')
      .select('id, title, url, uploaded_by, created_at, profiles(full_name)')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching programs:', error.message);
      return;
    }

    setPrograms(data);
    setHasMore(data.length === PROGRAMS_PER_PAGE);
  }, [page, session]);

  useEffect(() => {
    if (session) loadPrograms();
  }, [page, session, loadPrograms]);

  return (
    <div className="manage-programs" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Manage Programs</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: '1rem' }}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter program title"
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
          />
        </label>

        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Program'}
        </button>
      </form>

      <div className="programs-list">
        <h3>Uploaded Programs</h3>
        {programs.length === 0 ? (
          <p>No programs found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {programs.map((program) => (
              <li key={program.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
                <strong>{program.title}</strong> <br />
                Uploaded: {new Date(program.created_at).toLocaleString()} <br />
                By: {program.profiles?.full_name || 'Unknown'} <br />
                <audio controls src={program.url} style={{ width: '100%' }} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ManagePrograms;
