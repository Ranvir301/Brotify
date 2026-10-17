import React from 'react';
import { defaultCategories } from '../data/defaultSongs';
import heartFilledIcon from '../assets/icons/heart-filled.svg';
import heartOutlineIcon from '../assets/icons/heart-outline.svg';

export default function Search({
  songs,
  searchQuery,
  setSearchQuery,
  toggleLikeSong,
  likedSongIds,
  audioState,
}) {
  const { playSong, currentSong } = audioState;

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCategoryClick = (categoryName) => {
    setSearchQuery(categoryName);
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      {searchQuery === '' ? (
        <div>
          <h2 style={sectionTitleStyle}>Browse all</h2>
          <div style={categoriesGridStyle}>
            {defaultCategories.map((cat) => (
              <div
                key={cat.id}
                className="transition-all"
                style={categoryCardStyle(cat.color)}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <span style={categoryNameStyle}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 style={sectionTitleStyle}>Top results for "{searchQuery}"</h2>

          {filteredSongs.length > 0 ? (
            <div style={resultsTableStyle}>
              <div style={tableHeaderRowStyle}>
                <div style={colNumStyle}>#</div>
                <div style={colTitleStyle}>Title</div>
                <div style={colGenreStyle}>Genre</div>
                <div style={colActionsStyle}></div>
                <div style={colTimeStyle}>Duration</div>
              </div>

              {filteredSongs.map((song, idx) => {
                const isCurrent = currentSong && currentSong.id === song.id;
                const isLiked = likedSongIds.includes(song.id);
                return (
                  <div
                    key={song.id}
                    className="transition-all"
                    style={trackRowStyle(isCurrent)}
                    onClick={() => playSong(song, filteredSongs)}
                  >
                    <div style={colNumStyle}>
                      <span style={rowNumStyle}>{idx + 1}</span>
                    </div>

                    <div style={colTitleStyle}>
                      <img src={song.coverUrl} alt={song.title} style={trackCoverStyle} />
                      <div style={trackMetaStyle}>
                        <div style={trackNameStyle(isCurrent)}>{song.title}</div>
                        <div style={trackArtistStyle}>{song.artist}</div>
                      </div>
                    </div>

                    <div style={colGenreStyle}>
                      <span style={genreBadgeStyle}>{song.genre}</span>
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
            <div style={noResultsStyle}>
              <h3>No results found</h3>
              <p style={{color: '#9FB3CE', fontSize: '0.9rem', marginTop: '8px'}}>Please make sure your words are spelled correctly or try other keywords.</p>
            </div>
          )}
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
  padding: '24px 24px 100px 24px',
};

const sectionTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  color: '#fff',
  marginBottom: '20px',
  letterSpacing: '-0.3px',
};

const categoriesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '16px',
};

const categoryCardStyle = (bgColor) => ({
  height: '180px',
  borderRadius: '16px',
  backgroundColor: bgColor,
  padding: '16px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  transition: 'transform 0.2s',
});

const categoryNameStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  color: '#fff',
  wordBreak: 'break-word',
  letterSpacing: '-0.5px',
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

const rowNumStyle = {
  color: 'inherit',
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

const colGenreStyle = {
  width: '100px',
  display: 'flex',
  alignItems: 'center',
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

const noResultsStyle = {
  textAlign: 'center',
  padding: '80px 0',
};
