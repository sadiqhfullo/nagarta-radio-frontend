// frontend/radio-station-app/src/pages/HomePage.js
import React, { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';

const HomePage = () => {
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const featuredAudios = [
    {
      id: 1,
      title: 'Featured Program 1',
      description: 'A short description of our first featured program.',
      audio_url: 'https://tavushwilcozyqqugtrt.supabase.co/storage/v1/object/sign/radio/033.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzhiYmE4NDE0LWUyMGUtNDdmZS1hOTkxLWMxNTJiNThjYmQ2OSJ9.eyJ1cmwiOiJyYWRpby8wMzMubXAzIiwiaWF0IjoxNzQ3NzMxMDAyLCJleHAiOjE3NTAzMjMwMDJ9.59ZRsd6nxRoCD2NW_mwLW0K4LV5TJFjxtq4z08v21ho',
    },
    // You can add more featured programs here
  ];

  const liveStreamUrl = 'https://stream.zeno.fm/ghv22q41srhvv';

  const handleLike = (audioId) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [audioId]: (prevLikes[audioId] || 0) + 1,
    }));
    // In a real scenario, you'd send this to your backend
  };

  const handleCommentChange = (audioId, event) => {
    setNewComment(prevComments => ({
      ...prevComments,
      [audioId]: event.target.value,
    }));
  };

  const handlePostComment = (audioId) => {
    const commentText = newComment[audioId];
    if (commentText && commentText.trim() !== '') {
      setComments(prevComments => ({
        ...prevComments,
        [audioId]: [...(prevComments[audioId] || []), commentText],
      }));
      setNewComment(prevComments => ({ ...prevComments, [audioId]: '' })); // Clear input
      // In a real scenario, you'd send this to your backend
    }
  };

  const styles = {
    homePage: {
      fontFamily: 'sans-serif',
      margin: 0,
      backgroundColor: '#f0f0f0',
      color: '#333',
      padding: '20px',
      '@media (maxWidth: 768px)': { // Applying basic responsiveness here
        padding: '15px',
      },
    },
    homeHeader: {
      textAlign: 'center',
      paddingBottom: '20px',
      borderBottom: '1px solid #ccc',
      marginBottom: '20px',
      backgroundColor: '#e0e0e0',
      padding: '20px',
    },
    homeHeaderTitle: { // Style for the h1 element
      fontSize: '2em',
      '@media (maxWidth: 768px)': {
        fontSize: '1.8em',
      },
    },
    homeHeaderSubtitle: { // Style for the p element
      fontSize: '1em',
    },
    featuredPrograms: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '8px',
    },
    featuredProgramsTitle: {
      marginTop: '0',
      marginBottom: '15px',
      fontSize: '1.6em',
      '@media (maxWidth: 768px)': {
        fontSize: '1.4em',
      },
    },
    programItem: {
      backgroundColor: '#fff',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '5px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    liveStream: {
      backgroundColor: '#e8f5e9',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '8px',
    },
    liveStreamTitle: {
      marginTop: '0',
      marginBottom: '15px',
      fontSize: '1.6em',
      '@media (maxWidth: 768px)': {
        fontSize: '1.4em',
      },
    },
    homeFooter: {
      textAlign: 'center',
      marginTop: '30px',
      paddingTop: '15px',
      borderTop: '1px solid #ccc',
      color: '#777',
      backgroundColor: '#dcdcdc',
      padding: '10px',
      borderRadius: '5px',
    },
    audioPlayerContainer: {
      marginBottom: '10px',
    },
    likeCommentSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginTop: '10px',
    },
    likeButton: {
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '5px',
    },
    likeCount: {
      fontSize: '0.9em',
      color: '#555',
    },
    commentSection: {
      marginTop: '15px',
      borderTop: '1px solid #eee',
      paddingTop: '15px',
    },
    commentInputArea: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      '@media (maxWidth: 768px)': {
        flexDirection: 'column',
      },
    },
    commentInput: {
      flexGrow: 1,
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '0',
      '@media (maxWidth: 768px)': {
        marginBottom: '10px',
      },
    },
    postCommentButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    commentList: {
      listStyleType: 'none',
      padding: '0',
    },
    commentItem: {
      backgroundColor: '#fefefe',
      padding: '8px',
      marginBottom: '5px',
      borderRadius: '3px',
      border: '1px solid #ddd',
    },
  };

  return (
    <div style={styles.homePage}>
      <header style={styles.homeHeader}>
        <h1 style={styles.homeHeaderTitle}>Welcome to Our Radio Station!</h1>
        <p style={styles.homeHeaderSubtitle}>Your number one source for great audio content.</p>
      </header>

      <section style={styles.featuredPrograms}>
        <h2 style={styles.featuredProgramsTitle}>Featured Programs</h2>
        {featuredAudios.map(audio => (
          <div style={styles.programItem} key={audio.id}>
            <h3>{audio.title}</h3>
            <p>{audio.description}</p>
            <div style={styles.audioPlayerContainer}>
              <AudioPlayer audioUrl={audio.audio_url} />
            </div>
            <div style={styles.likeCommentSection}>
              <button style={styles.likeButton} onClick={() => handleLike(audio.id)}>
                Like
              </button>
              <span style={styles.likeCount}>({likes[audio.id] || 0} likes)</span>
            </div>
            <div style={styles.commentSection}>
              <h4>Comments</h4>
              <ul style={styles.commentList}>
                {(comments[audio.id] || []).map((comment, index) => (
                  <li style={styles.commentItem} key={index}>
                    {comment}
                  </li>
                ))}
                {(comments[audio.id] || []).length === 0 && <p>No comments yet.</p>}
              </ul>
              <div style={styles.commentInputArea}>
                <input
                  type="text"
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment[audio.id] || ''}
                  onChange={(e) => handleCommentChange(audio.id, e)}
                />
                <button style={styles.postCommentButton} onClick={() => handlePostComment(audio.id)}>
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
        {featuredAudios.length === 0 && <p>No featured programs available yet.</p>}
      </section>

      <section style={styles.liveStream}>
        <h2 style={styles.liveStreamTitle}>Listen Live</h2>
        {liveStreamUrl ? (
          <div style={styles.audioPlayerContainer}>
            <AudioPlayer audioUrl={liveStreamUrl} />
          </div>
        ) : (
          <p>Live stream currently unavailable.</p>
        )}
        <p>Tune in now to our live broadcast!</p>
      </section>

      <footer style={styles.homeFooter}>
        <p>&copy; {new Date().getFullYear()} Your Radio Station Name</p>
      </footer>
    </div>
  );
};

export default HomePage;