import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Player from './Player';


export default function AppLayout({
  currentUser,
  likedSongIds,
  searchQuery,
  setSearchQuery,
  logout,
  audioState,
  toggleLikeSong,
}) {
  return (
    <div style={appContainerStyle}>
      <div style={mainRowStyle}>
        <Sidebar
          currentUser={currentUser}
          likedSongIds={likedSongIds}
        />

        <div style={rightColumnStyle}>
          <Header
            currentUser={currentUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            logout={logout}
          />
          <div style={pageContentStyle}>
            <Outlet />
          </div>
        </div>
      </div>

      <Player
        audioState={audioState}
        likedSongIds={likedSongIds}
        toggleLikeSong={toggleLikeSong}
      />
    </div>
  );
}

const appContainerStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0F1E36',
};

const mainRowStyle = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
  paddingBottom: '90px',
};

const rightColumnStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#16294A',
  borderRadius: '16px',
  margin: '8px 8px 8px 0',
};

const pageContentStyle = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};
