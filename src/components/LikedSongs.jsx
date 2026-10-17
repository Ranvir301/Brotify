import React from 'react';
import { useNavigate } from 'react-router-dom';
import heartWhiteIcon from '../assets/icons/heart-white.svg';
import heartFilledIcon from '../assets/icons/heart-filled.svg';
import heartOutlineIcon from '../assets/icons/heart-outline.svg';

export default function LikedSongs({
  likedSongIds,
  getLikedSongs,
  toggleLikeSong,
  audioState,
}) {
  const navigate = useNavigate();
  const { playSong, currentSong } = audioState;

  const likedSongs = getLikedSongs ? getLikedSongs() : [];

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={containerStyle} className="animate-fade-in">

      <div style={heroHeaderStyle}>
        <div className="liked-gradient" style={heroCoverGradientStyle}>
          <img src={heartWhiteIcon} alt="Liked Songs" width="60" height="60" />
        </div>

        <div style={heroMetaStyle}>
          <h1 style={metaTitleStyle}>
            Liked Songs
          </h1>

          <div style={metaStatsStyle}>
            <span style={{fontWeight: '700'}}>You</span>
            <span style={bulletStyle}>•</span>
            <span>{likedSongs.length} songs</span>
          </div>
        </div>
      </div>

      {likedSongs.length > 0 ? (
        <div style={resultsTableStyle}>
          <div style={tableHeaderRowStyle}>
            <div style={colNumStyle}>#</div>
            <div style={colTitleStyle}>Title</div>
            <div style={colActionsStyle}></div>
            <div style={colTimeStyle}>Duration</div>
          </div>

          {likedSongs.map((song, idx) => {
            const isCurrent = currentSong && currentSong.id === song.id;
            const isLiked = likedSongIds.includes(song.id);
            return (
              <div
                key={song.id}
                className="transition-all"
                style={trackRowStyle(isCurrent)}
                onClick={() => playSong(song, likedSongs)}
              >
                <div style={colNumStyle}>
                  <span>{idx + 1}</span>
                </div>

                <div style={colTitleStyle}>
                  <img src={song.coverUrl} alt={song.title} style={trackCoverStyle} />
                  <div style={trackMetaStyle}>
                    <div style={trackNameStyle(isCurrent)}>{song.title}</div>
                    <div style={trackArtistStyle}>{song.artist}</div>
                  </div>
                </div>

                <div style={colActionsStyle} onClick={(e) => e.stopPropagation()}>
                  <button
                    style={actionBtnStyle}
                    onClick={() => toggleLikeSong(song.id)}
                    title={isLiked ? "Unlike" : "Like"}
                  >
                    <img
                      src={isLiked ? heartFilledIcon : heartOutlineIcon}
                      alt={isLiked ? "Unlike" : "Like"}
                      width="16"
                      height="16"
                    />
                  </button>
                </div>

                <div style={colTimeStyle}>{formatDuration(song.duration)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyTextStyle}>
          No liked songs yet
        </div>
      )}
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

const heroHeaderStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '24px',
  paddingTop: '40px',
  paddingBottom: '24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const heroCoverGradientStyle = {
  width: '192px',
  height: '192px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  flexShrink: 0,
};

const heroMetaStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const metaTitleStyle = {
  fontSize: '3rem',
  fontWeight: '900',
  color: '#fff',
  letterSpacing: '-1px',
  lineHeight: '1.1',
  wordBreak: 'break-word',
};

const metaStatsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.85rem',
  color: '#9FB3CE',
  marginTop: '4px',
};

const bulletStyle = {
  fontSize: '0.6rem',
};

const resultsTableStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const tableHeaderRowStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderBottom: '1px solid #2A4166',
  color: '#9FB3CE',
  fontSize: '0.78rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const trackRowStyle = (isCurrent) => ({
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  padding: '0 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  backgroundColor: isCurrent ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
});

const colNumStyle = {
  width: '40px',
  color: '#9FB3CE',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
};

const colTitleStyle = {
  flex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  overflow: 'hidden',
};

const trackCoverStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  objectFit: 'cover',
  flexShrink: 0,
};

const trackMetaStyle = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const trackNameStyle = (isCurrent) => ({
  fontSize: '0.88rem',
  fontWeight: '600',
  color: isCurrent ? '#F4A340' : '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const trackArtistStyle = {
  fontSize: '0.78rem',
  color: '#9FB3CE',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: '2px',
};

const colActionsStyle = {
  width: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
};

const colTimeStyle = {
  width: '80px',
  textAlign: 'right',
  color: '#9FB3CE',
  fontSize: '0.85rem',
};

const emptyTextStyle = {
  padding: '60px 0',
  color: '#9FB3CE',
  fontSize: '1rem',
  fontWeight: '500',
  textAlign: 'center',
};
