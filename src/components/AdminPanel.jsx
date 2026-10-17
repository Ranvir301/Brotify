import React, { useState } from 'react';

export default function AdminPanel({ songs, addSong, deleteSong }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [genre, setGenre] = useState('Punjabi');
  const [duration, setDuration] = useState('240');

  const [message, setMessage] = useState({ text: '', type: '' });

  const demoCatalog = [
    {
      title: "Brown Munde",
      artist: "AP Dhillon",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
      genre: "Punjabi",
      duration: "302"
    },
    {
      title: "Midnight Drive Lofi",
      artist: "Lofi Beats Collective",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60",
      genre: "Lofi",
      duration: "344"
    },
    {
      title: "Tears in Rain",
      artist: "Sad Symphony",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60",
      genre: "Sad Song",
      duration: "382"
    },
    {
      title: "Still Dre Remix",
      artist: "Hip Hop Beats",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
      genre: "Hip Hop",
      duration: "425"
    }
  ];

  const handleFillDemoData = () => {
    const randomTrack = demoCatalog[Math.floor(Math.random() * demoCatalog.length)];
    setTitle(randomTrack.title);
    setArtist(randomTrack.artist);
    setAudioUrl(randomTrack.audioUrl);
    setCoverUrl(randomTrack.coverUrl);
    setGenre(randomTrack.genre);
    setDuration(randomTrack.duration);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !artist || !coverUrl || !audioUrl) {
      setMessage({ text: 'Please fill in all fields!', type: 'error' });
      return;
    }

    addSong({
      title: title.trim(),
      artist: artist.trim(),
      coverUrl: coverUrl.trim(),
      audioUrl: audioUrl.trim(),
      genre,
      duration: parseInt(duration) || 240,
    });

    setMessage({ text: `Successfully uploaded "${title}" to Brotify!`, type: 'success' });

    setTitle('');
    setArtist('');
    setCoverUrl('');
    setAudioUrl('');
    setDuration('240');

    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (songId, songTitle) => {
    if (window.confirm(`Permanently delete "${songTitle}"?`)) {
      deleteSong(songId);
      setMessage({ text: `Deleted "${songTitle}" from database.`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={headerSectionStyle}>
        <h1 style={titleStyle}>Admin Console</h1>
        <p style={subtitleStyle}>Manage catalog tracks, categories, and music metadata.</p>
      </div>

      {message.text && (
        <div style={alertStyle(message.type)}>
          {message.text}
        </div>
      )}

      <div style={contentGridStyle}>

        <div style={formSectionStyle}>
          <div style={formHeaderStyle}>
            <h2 style={sectionTitleStyle}>Upload New Track</h2>
            <button
              type="button"
              onClick={handleFillDemoData}
              style={demoBtnStyle}
              title="Populates form with Punjabi, Lofi, Sad or Hip Hop demo data"
            >
              Fill Demo Data
            </button>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Song Title</label>
              <input
                type="text"
                placeholder="e.g. Brown Munde"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Artist Name</label>
              <input
                type="text"
                placeholder="e.g. AP Dhillon"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={rowInputGridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  style={selectStyle}
                >
                  <option value="Punjabi">Punjabi</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Lofi">Lofi</option>
                  <option value="Sad Song">Sad Song</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Duration (sec)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Cover Image URL</label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/..."
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Audio Stream (MP3 URL)</label>
              <input
                type="text"
                placeholder="e.g. https://www.soundhelix.com/examples/mp3/..."
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button type="submit" style={submitBtnStyle} className="transition-all">
              Add Track to Library
            </button>
          </form>
        </div>

        <div style={listSectionStyle}>
          <h2 style={sectionTitleStyle}>Catalog Library ({songs.length} songs)</h2>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeadStyle}>
                  <th style={thStyle}>Track</th>
                  <th style={thStyle}>Genre</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id} style={trStyle}>
                    <td style={tdStyle}>
                      <div style={trackCellInfoStyle}>
                        <img src={song.coverUrl} alt={song.title} style={trackThumbStyle} />
                        <div style={trackTextWrapperStyle}>
                          <div style={trackNameStyle}>{song.title}</div>
                          <div style={trackArtistStyle}>{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={genreBadgeStyle}>{song.genre}</span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={deleteBtnStyle}
                        onClick={() => handleDelete(song.id, song.title)}
                        title="Delete track"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styling
const containerStyle = {
  flex: 1,
  overflowY: 'auto',
  height: '100%',
  padding: '24px 24px 100px 24px',
};

const headerSectionStyle = {
  marginBottom: '24px',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  letterSpacing: '-0.5px',
};

const subtitleStyle = {
  color: '#9FB3CE',
  marginTop: '8px',
};

const alertStyle = (type) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '20px',
  fontSize: '0.85rem',
  fontWeight: '600',
  backgroundColor: type === 'error' ? 'rgba(255, 77, 77, 0.12)' : 'rgba(244, 163, 64, 0.12)',
  border: `1px solid ${type === 'error' ? '#ff4d4d' : '#F4A340'}`,
  color: type === 'error' ? '#ff9999' : '#F4A340',
});

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: '380px 1fr',
  gap: '32px',
  alignItems: 'start',
};

const formSectionStyle = {
  backgroundColor: '#16294A',
  borderRadius: '16px',
  padding: '24px',
};

const formHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  gap: '8px',
};

const sectionTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '800',
  color: '#fff',
};

const demoBtnStyle = {
  backgroundColor: 'transparent',
  color: '#F4A340',
  border: '1px solid #F4A340',
  padding: '6px 10px',
  borderRadius: '14px',
  fontSize: '0.72rem',
  fontWeight: '700',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left',
};

const labelStyle = {
  fontSize: '0.72rem',
  fontWeight: '700',
  color: '#9FB3CE',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  backgroundColor: '#16294A',
  border: '1px solid transparent',
  borderRadius: '10px',
  color: '#fff',
  padding: '10px 12px',
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const rowInputGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const submitBtnStyle = {
  backgroundColor: '#F4A340',
  color: '#000',
  border: 'none',
  padding: '12px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '6px',
};

const listSectionStyle = {
  backgroundColor: '#16294A',
  borderRadius: '16px',
  padding: '24px',
};

const tableWrapperStyle = {
  overflowX: 'auto',
  marginTop: '16px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeadStyle = {
  borderBottom: '1px solid #2A4166',
};

const thStyle = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: '0.72rem',
  fontWeight: '700',
  color: '#9FB3CE',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const trStyle = {
  borderBottom: '1px solid #2A4166',
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: '0.85rem',
  color: '#fff',
};

const trackCellInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const trackThumbStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  objectFit: 'cover',
  flexShrink: 0,
};

const trackTextWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const trackNameStyle = {
  fontWeight: '600',
  fontSize: '0.85rem',
};

const trackArtistStyle = {
  fontSize: '0.75rem',
  color: '#9FB3CE',
};

const genreBadgeStyle = {
  fontSize: '0.7rem',
  fontWeight: '700',
  color: '#9FB3CE',
  backgroundColor: '#282828',
  padding: '4px 8px',
  borderRadius: '12px',
  textTransform: 'capitalize',
};

const deleteBtnStyle = {
  backgroundColor: 'transparent',
  color: '#ff4d4d',
  border: '1px solid #ff4d4d',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.72rem',
  fontWeight: '700',
  cursor: 'pointer',
};
