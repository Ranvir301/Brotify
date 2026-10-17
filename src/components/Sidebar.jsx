import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoIcon from '../assets/icons/logo.svg';
import homeActiveIcon from '../assets/icons/home-active.svg';
import homeInactiveIcon from '../assets/icons/home-inactive.svg';
import searchActiveIcon from '../assets/icons/search-active.svg';
import searchInactiveIcon from '../assets/icons/search-inactive.svg';
import adminActiveIcon from '../assets/icons/admin-active.svg';
import adminInactiveIcon from '../assets/icons/admin-inactive.svg';
import libraryIcon from '../assets/icons/library.svg';
import heartWhiteIcon from '../assets/icons/heart-white.svg';

export default function Sidebar({ currentUser, likedSongIds }) {
  const location = useLocation();

  const isAdmin = currentUser && currentUser.role === 'admin';
  const isOnLikedSongs = location.pathname === '/liked-songs';

  return (
    <div style={sidebarStyle}>

      
      <NavLink to="/" style={logoContainerStyle}>
        <img src={logoIcon} alt="Brotify" width="40" height="40" />
        <span style={logoTextStyle}>Brotify</span>
      </NavLink>

      
      <div style={menuContainerStyle}>
        <NavLink
          to="/"
          end
          className="transition-all"
          style={({ isActive }) => menuItemStyle(isActive)}
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? homeActiveIcon : homeInactiveIcon}
                alt="Home"
                width="24"
                height="24"
              />
              Home
            </>
          )}
        </NavLink>

        <NavLink
          to="/search"
          className="transition-all"
          style={({ isActive }) => menuItemStyle(isActive)}
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? searchActiveIcon : searchInactiveIcon}
                alt="Search"
                width="24"
                height="24"
              />
              Search
            </>
          )}
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className="transition-all"
            style={({ isActive }) => menuItemStyle(isActive)}
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? adminActiveIcon : adminInactiveIcon}
                  alt="Admin Panel"
                  width="24"
                  height="24"
                />
                Admin Panel
              </>
            )}
          </NavLink>
        )}
      </div>

      
      <div style={libraryContainerStyle}>
        <div style={libraryHeaderStyle}>
          <div style={libraryTitleStyle}>
            <img src={libraryIcon} alt="Your Library" width="24" height="24" />
            <span>Your Library</span>
          </div>
        </div>

        <div style={libraryListStyle}>
          
          <NavLink to="/liked-songs" style={likedItemStyle(isOnLikedSongs)}>
            <div className="liked-gradient" style={likedIconWrapperStyle}>
              <img src={heartWhiteIcon} alt="Liked Songs" width="16" height="16" />
            </div>
            <div style={likedInfoStyle}>
              <div style={likedNameStyle}>Liked Songs</div>
              <div style={likedSubtextStyle}>{likedSongIds.length} songs</div>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

// Styling
const sidebarStyle = {
  width: '300px',
  backgroundColor: '#0F1E36',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
  gap: '8px',
  height: '100%',
  flexShrink: 0,
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  gap: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit',
};

const logoTextStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  color: '#F4A340',
};

const menuContainerStyle = {
  backgroundColor: '#16294A',
  borderRadius: '16px',
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const menuItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  color: isActive ? '#ffffff' : '#9FB3CE',
  padding: '12px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.95rem',
  backgroundColor: isActive ? 'rgba(244, 163, 64, 0.15)' : 'transparent',
  textDecoration: 'none',
});

const libraryContainerStyle = {
  backgroundColor: '#16294A',
  borderRadius: '16px',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
};

const libraryHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 4px 16px 4px',
};

const libraryTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#9FB3CE',
  fontWeight: '700',
  fontSize: '0.95rem',
};

const libraryListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  overflowY: 'auto',
  paddingRight: '4px',
};

const likedItemStyle = (isSelected) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px',
  borderRadius: '12px',
  cursor: 'pointer',
  backgroundColor: isSelected ? 'rgba(244, 163, 64, 0.15)' : 'transparent',
  textDecoration: 'none',
  color: 'inherit',
});

const likedIconWrapperStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const likedInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
};

const likedNameStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#ffffff',
};

const likedSubtextStyle = {
  fontSize: '0.78rem',
  color: '#9FB3CE',
};
