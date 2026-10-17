import React from 'react';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import heartFilledIcon from '../assets/icons/heart-filled.svg';
import heartOutlineIcon from '../assets/icons/heart-outline.svg';

export default function SongCard({
  song,
  contextQueue,
  audioState,
  toggleLikeSong,
  likedSongIds,
}) {
  const { playSong, currentSong, isPlaying } = audioState;

  const isCurrent = currentSong && currentSong.id === song.id;
  const isLiked = likedSongIds.includes(song.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    playSong(song, contextQueue);
  };

  return (
    <div
      className="transition-all"
      style={cardStyle(isCurrent)}
      onClick={() => playSong(song, contextQueue)}
    >
      <div style={imageWrapperStyle}>
        <img src={song.coverUrl} alt={song.title} style={imageStyle} />
        <button
          className="transition-all"
          style={playButtonStyle(isCurrent && isPlaying)}
          onClick={handlePlayClick}
        >
          <img
            src={isCurrent && isPlaying ? pauseIcon : playIcon}
            alt={isCurrent && isPlaying ? "Pause" : "Play"}
            width="20"
            height="20"
            style={isCurrent && isPlaying ? undefined : { marginLeft: '2px' }}
          />
        </button>
      </div>

      <div style={detailsStyle}>
        <div style={titleStyle(isCurrent)}>{song.title}</div>
        <div style={artistStyle}>{song.artist}</div>
      </div>

      <div style={optionsWrapperStyle}>
        <button
          style={actionBtnStyle}
          onClick={(e) => { e.stopPropagation(); toggleLikeSong(song.id); }}
          title={isLiked ? "Unlike" : "Like"}
        >
          <img
            src={isLiked ? heartFilledIcon : heartOutlineIcon}
            alt={isLiked ? "Unlike" : "Like"}
            width="18"
            height="18"
          />
        </button>
      </div>
    </div>
  );
}

// Styling
const cardStyle = (isCurrent) => ({
  backgroundColor: isCurrent ? 'rgba(244, 163, 64, 0.12)' : '#16294A',
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  width: '180px',
  height: '270px',
  cursor: 'pointer',
  position: 'relative',
  border: '1px solid rgba(244, 163, 64, 0.05)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  transition: 'background-color 0.3s, transform 0.3s',
  flexShrink: 0,
});

const imageWrapperStyle = {
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
};

const imageStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const playButtonStyle = (isPlayingTrack) => ({
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#F4A340',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: isPlayingTrack ? '1' : '0',
  transform: isPlayingTrack ? 'translateY(0)' : 'translateY(8px)',
  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
  transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
  zIndex: '5',
});

const detailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  overflow: 'hidden',
};

const titleStyle = (isCurrent) => ({
  fontSize: '0.92rem',
  fontWeight: '700',
  color: isCurrent ? '#F4A340' : '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const artistStyle = {
  fontSize: '0.8rem',
  color: '#9FB3CE',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const optionsWrapperStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: '12px',
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
};
