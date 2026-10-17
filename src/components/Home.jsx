import React from 'react';
import { useNavigate } from 'react-router-dom';
import SongCard from './SongCard';
import playIcon from '../assets/icons/play.svg';
import musicNoteIcon from '../assets/icons/music-note.svg';

export default function Home({
  songs,
  toggleLikeSong,
  likedSongIds,
  audioState,
}) {
  const navigate = useNavigate();
  const { playSong } = audioState;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickGridSongs = songs.slice(0, 6);

  return (
    <div style={containerStyle} className="spotify-gradient animate-fade-in">
      <div style={scrollContentStyle}>

        <h1 style={greetingStyle}>{getGreeting()}</h1>

        {songs.length > 0 ? (
          <>
            
            <div style={quickGridStyle}>
              {quickGridSongs.map((song) => (
                <div
                  key={song.id}
                  className="transition-all"
                  style={quickCardStyle}
                  onClick={() => playSong(song, songs)}
                >
                  <img src={song.coverUrl} alt={song.title} style={quickImageStyle} />
                  <div style={quickTitleContainerStyle}>
                    <span style={quickTitleStyle}>{song.title}</span>
                    <span style={quickArtistStyle}>{song.artist}</span>
                  </div>
                  <button className="quick-play-btn transition-all" style={quickPlayBtnStyle}>
                    <img src={playIcon} alt="Play" width="16" height="16" />
                  </button>
                </div>
              ))}
            </div>

            
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Recommended Songs</h2>
              <div style={carouselStyle}>
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    contextQueue={songs}
                    audioState={audioState}
                    toggleLikeSong={toggleLikeSong}
                    likedSongIds={likedSongIds}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={emptyOnboardingStyle}>
            <img src={musicNoteIcon} alt="Empty music library" width="64" height="64" />
            <h2 style={{marginTop: '20px', fontWeight: '800'}}>Brotify Music Library is empty</h2>
            <p style={{color: '#a7a7a7', marginTop: '8px', maxWidth: '400px'}}>
              There are currently no songs in the library.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// Styling
const containerStyle = {
  flex: 1,
  overflowY: 'auto',
  height: '100%',
  padding: '0 24px 100px 24px',
};

const scrollContentStyle = {
  paddingTop: '20px',
};

const greetingStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  marginBottom: '24px',
  color: '#fff',
  letterSpacing: '-0.5px',
};

const quickGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
  marginBottom: '40px',
};

const quickCardStyle = {
  height: '64px',
  backgroundColor: 'rgba(244, 163, 64, 0.1)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'background-color 0.2s',
};

const quickImageStyle = {
  width: '64px',
  height: '64px',
  objectFit: 'cover',
  flexShrink: 0,
};

const quickTitleContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 16px',
  overflow: 'hidden',
  flex: 1,
};

const quickTitleStyle = {
  fontSize: '0.88rem',
  fontWeight: '700',
  color: '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const quickArtistStyle = {
  fontSize: '0.75rem',
  color: '#9FB3CE',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: '2px',
};

const quickPlayBtnStyle = {
  position: 'absolute',
  right: '16px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#F4A340',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: '0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  transition: 'all 0.25s ease',
  transform: 'scale(0.8)',
};

const sectionStyle = {
  marginBottom: '40px',
};

const sectionTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  color: '#fff',
  marginBottom: '16px',
  letterSpacing: '-0.3px',
};

const carouselStyle = {
  display: 'flex',
  gap: '20px',
  overflowX: 'auto',
  paddingBottom: '16px',
  scrollSnapType: 'x mandatory',
};

const emptyOnboardingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 0',
  textAlign: 'center',
};

const onboardingBtnStyle = {
  backgroundColor: '#ffffff',
  color: '#000000',
  border: 'none',
  padding: '12px 28px',
  borderRadius: '24px',
  fontSize: '0.9rem',
  fontWeight: '700',
  marginTop: '24px',
  cursor: 'pointer',
};
