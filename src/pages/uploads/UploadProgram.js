import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // adjust path if needed
import { useSession } from '@supabase/auth-helpers-react';

const UploadProgram = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const session = useSession();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setMessage('Please provide both title and audio file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `programs/${fileName}`;

    // 1. Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('programs')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading file: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Get public URL of uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('programs')
      .getPublicUrl(filePath);

    const url = publicUrlData.publicUrl;

    // 3. Insert into `programs` table
    const { error: insertError } = await supabase.from('programs').insert([
      {
        title,
        url,
        uploaded_by: session?.user?.id || null,
      },
    ]);

    if (insertError) {
      setMessage('File uploaded but database insert failed: ' + insertError.message);
    } else {
      setMessage('Program uploaded successfully!');
      setTitle('');
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '1rem' }}>
      <h2>Upload Audio Program</h2>

      <input
        type="text"
        placeholder="Enter program title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <input type="file" accept="audio/*" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: '10px' }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default UploadProgram;
