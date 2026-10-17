import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import searchIcon from '../assets/icons/search.svg';
import chevronDownIcon from '../assets/icons/chevron-down.svg';
import logoutIcon from '../assets/icons/logout.svg';
 
export default function Header({ currentUser, searchQuery, setSearchQuery, logout }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  if (!currentUser) return null;
 
  const isOnSearchPage = location.pathname === '/search';
 
  return (
    <div style={headerStyle}>
      
      {isOnSearchPage && (
        <div style={searchContainerStyle}>
          <img src={searchIcon} alt="Search" width="20" height="20" style={searchIconStyle} />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      )}
 
      
      <div style={rightMenuContainerStyle}>
        <div
          className="transition-all"
          style={profilePillStyle}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={
              currentUser.role === 'admin'
                ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            }
            alt="Profile"
            style={profileImageStyle}
          />
          <span style={profileNameStyle}>
            {currentUser.username}
          </span>
          <img
            src={chevronDownIcon}
            alt={dropdownOpen ? "Close menu" : "Open menu"}
            width="16"
            height="16"
            style={{transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}}
          />
        </div>
 
        {dropdownOpen && (
          <div style={dropdownStyle} className="dropdown-menu animate-fade-in">
            <div
              className="dropdown-item"
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              style={{color: '#ff4d4d', fontWeight: '600'}}
            >
              <img src={logoutIcon} alt="Log Out" width="16" height="16" />
              Log Out
            </div>
            <div style={dividerStyle} />
            <div className="dropdown-item" style={{cursor: 'default', color: '#727272'}}>
              Role: {currentUser.role.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
// Styling
const headerStyle = {
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: '0 24px',
  position: 'relative',
  zIndex: 10,
};
 
const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: '0 1 360px',
  marginLeft: '16px',
};
 
const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  pointerEvents: 'none',
};
 
const searchInputStyle = {
  width: '100%',
  padding: '12px 12px 12px 42px',
  borderRadius: '500px',
  backgroundColor: '#16294A',
  border: '1px solid transparent',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: '500',
  outline: 'none',
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  transition: 'border-color 0.2s, background-color 0.2s',
};
 
const rightMenuContainerStyle = {
  position: 'relative',
  marginLeft: 'auto',
};
 
const profilePillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px 4px 4px',
  borderRadius: '24px',
  backgroundColor: 'rgba(22, 41, 74, 0.85)',
  cursor: 'pointer',
  border: '1px solid rgba(244, 163, 64, 0.15)',
  userSelect: 'none',
};
 
const profileImageStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  objectFit: 'cover',
};
 
const profileNameStyle = {
  fontSize: '0.85rem',
  fontWeight: '700',
  color: '#fff',
};
 
const dropdownStyle = {
  right: '0',
  top: '42px',
};
 
const dividerStyle = {
  height: '1px',
  backgroundColor: '#2A4166',
  margin: '4px 0',
};
 