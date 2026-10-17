import React from 'react';
import heartFilledIcon from '../assets/icons/heart-filled.svg';
import heartOutlineIcon from '../assets/icons/heart-outline.svg';
import previousIcon from '../assets/icons/previous.svg';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import nextIcon from '../assets/icons/next.svg';
import volumeMuteIcon from '../assets/icons/volume-mute.svg';
import volumeLowIcon from '../assets/icons/volume-low.svg';
import volumeHighIcon from '../assets/icons/volume-high.svg';

export default function Player({ audioState, likedSongIds, toggleLikeSong }) {
  const {
    currentSong, isPlaying, progress, duration, volume, isMuted,
    togglePlay, nextSong, prevSong, seek, adjustVolume, toggleMute,
  } = audioState;

  const isLiked = currentSong && likedSongIds.includes(currentSong.id);

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div style={playerContainerStyle}>

      {}
      <div style={trackInfoSectionStyle}>
        {currentSong ? (
          <>
            <img src={currentSong.coverUrl} alt={currentSong.title} style={playerCoverStyle} />
            <div style={playerTextWrapperStyle}>
              <div style={playerTitleStyle}>{currentSong.title}</div>
              <div style={playerArtistStyle}>{currentSong.artist}</div>
            </div>
            <button
              style={heartBtnStyle}
              onClick={() => toggleLikeSong(currentSong.id)}
              title={isLiked ? "Unlike" : "Like"}
            >
              <img
                src={isLiked ? heartFilledIcon : heartOutlineIcon}
                alt={isLiked ? "Unlike" : "Like"}
                width="16"
                height="16"
              />
            </button>
          </>
        ) : (
          <div style={noTrackStyle}>No song playing</div>
        )}
      </div>

      {}
      <div style={controlsSectionStyle}>
        <div style={controlsRowStyle}>
          <button style={controlBtnStyle(false)} onClick={prevSong} title="Previous">
            <img src={previousIcon} alt="Previous" width="20" height="20" />
          </button>

          <button
            className="transition-all"
            style={playPauseBtnStyle}
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            <img
              src={isPlaying ? pauseIcon : playIcon}
              alt={isPlaying ? "Pause" : "Play"}
              width="20"
              height="20"
              style={isPlaying ? undefined : { marginLeft: '2px' }}
            />
          </button>

          <button style={controlBtnStyle(false)} onClick={nextSong} title="Next">
            <img src={nextIcon} alt="Next" width="20" height="20" />
          </button>
        </div>

        <div style={progressRowStyle}>
          <span style={timeLabelStyle}>{formatTime(progress)}</span>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(e.target.value)}
              style={{
                width: '100%',
                background: `linear-gradient(to right, #F4A340 0%, #F4A340 ${progressPercent}%, #2A4166 ${progressPercent}%, #2A4166 100%)`
              }}
            />
          </div>
          <span style={timeLabelStyle}>{formatTime(duration)}</span>
        </div>
      </div>

      {}
      <div style={volumeSectionStyle}>
        <button style={volumeBtnStyle} onClick={toggleMute}>
          <img
            src={
              isMuted || volume === 0
                ? volumeMuteIcon
                : volume < 0.5
                ? volumeLowIcon
                : volumeHighIcon
            }
            alt={isMuted || volume === 0 ? "Muted" : volume < 0.5 ? "Low volume" : "High volume"}
            width="20"
            height="20"
          />
        </button>

        <div style={sliderContainerStyle}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => adjustVolume(e.target.value)}
            style={{
              width: '80px',
              background: `linear-gradient(to right, #F4A340 0%, #F4A340 ${volumePercent}%, #2A4166 ${volumePercent}%, #2A4166 100%)`
            }}
          />
        </div>
      </div>

    </div>
  );
}

// Styling
const playerContainerStyle = {
  height: '90px',
  backgroundColor: '#16294A',
  borderTop: '1px solid #2A4166',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  position: 'fixed',
  bottom: '0',
  left: '0',
  right: '0',
  zIndex: '500',
  boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
};

const trackInfoSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '30%',
  minWidth: '180px',
};

const playerCoverStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '10px',
  objectFit: 'cover',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

const playerTextWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 14px',
  overflow: 'hidden',
};

const playerTitleStyle = {
  fontSize: '0.88rem',
  fontWeight: '600',
  color: '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const playerArtistStyle = {
  fontSize: '0.75rem',
  color: '#9FB3CE',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: '2px',
};

const heartBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
};

const noTrackStyle = {
  fontSize: '0.85rem',
  color: '#9FB3CE',
  fontStyle: 'italic',
};

const controlsSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  maxWidth: '45%',
};

const controlsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '8px',
};

const controlBtnStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  color: isActive ? '#F4A340' : '#9FB3CE',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const playPauseBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const progressRowStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '8px',
};

const timeLabelStyle = {
  fontSize: '0.72rem',
  color: '#9FB3CE',
  width: '32px',
  textAlign: 'center',
};

const sliderContainerStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
};

const volumeSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '30%',
  minWidth: '180px',
  gap: '12px',
};

const volumeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#9FB3CE',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
};
