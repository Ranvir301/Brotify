
import React, { useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { defaultSongs } from './data/defaultSongs';
 
import AppLayout from './components/AppLayout';
import AuthPage from './components/AuthPage';
import Home from './components/Home';
import Search from './components/Search';
import LikedSongs from './components/LikedSongs';
import AdminPanel from './components/AdminPanel';
 
export default function App() {
  const navigate = useNavigate();
 
  
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('brotify_users');
    if (saved) return JSON.parse(saved);
    return [{ username: 'admin', password: 'admin123', role: 'admin' }];
  });
 
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('brotify_session_user');
    return saved ? JSON.parse(saved) : null;
  });
 
  
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('brotify_songs');
    return saved ? JSON.parse(saved) : defaultSongs;
  });
 
  const [likedSongIds, setLikedSongIds] = useState(() => {
    const saved = localStorage.getItem('brotify_liked');
    return saved ? JSON.parse(saved) : [];
  });
 
  const [searchQuery, setSearchQuery] = useState('');
 
  const audioRef = useRef(null);
 
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
 
  
  const login = (username, password) => {
    const user = usersList.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (user && user.password === password) {
      setCurrentUser(user);
      sessionStorage.setItem('brotify_session_user', JSON.stringify(user));
      navigate(user.role === 'admin' ? '/admin' : '/');
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password!' };
  };
 
  const signup = (username, password) => {
    const nameTrimmed = username.trim();
    if (nameTrimmed.toLowerCase() === 'admin') {
      return { success: false, message: 'Username "admin" is reserved!' };
    }
    const exists = usersList.some(
      (u) => u.username.toLowerCase() === nameTrimmed.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Username already exists!' };
    }
 
    const newUser = { username: nameTrimmed, password, role: 'user' };
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    localStorage.setItem('brotify_users', JSON.stringify(updatedUsers));
 
    setCurrentUser(newUser);
    sessionStorage.setItem('brotify_session_user', JSON.stringify(newUser));
    navigate('/');
    return { success: true };
  };
 
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('brotify_session_user');
    navigate('/login');
  };

  const addSong = (newSong) => {
    const songWithId = {
      ...newSong,
      id: `custom-${Date.now()}`,
      duration: Number(newSong.duration) || 240,
    };
    const updated = [songWithId, ...songs];
    setSongs(updated);
    localStorage.setItem('brotify_songs', JSON.stringify(updated));
    return songWithId;
  };
 
  const deleteSong = (songId) => {
    const updatedSongs = songs.filter((s) => s.id !== songId);
    setSongs(updatedSongs);
    localStorage.setItem('brotify_songs', JSON.stringify(updatedSongs));
 
    const updatedLikes = likedSongIds.filter((id) => id !== songId);
    setLikedSongIds(updatedLikes);
    localStorage.setItem('brotify_liked', JSON.stringify(updatedLikes));
  };
 
  
  const toggleLikeSong = (songId) => {
    const updated = likedSongIds.includes(songId)
      ? likedSongIds.filter((id) => id !== songId)
      : [...likedSongIds, songId];
    setLikedSongIds(updated);
    localStorage.setItem('brotify_liked', JSON.stringify(updated));
  };
 
  
  const getLikedSongs = () => {
    return likedSongIds.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  };
 
 
  const playSong = (song, customQueue = null) => {
    if (!song) return;
    const activeQueue = customQueue || songs;
    const index = activeQueue.findIndex((s) => s.id === song.id);
 
    setQueue(activeQueue);
    setCurrentIndex(index);
    setCurrentSong(song);
    setIsPlaying(true);
 
    const audio = audioRef.current;
    audio.src = song.audioUrl;
    audio.currentTime = 0;
    audio.volume = isMuted ? 0 : volume;
    audio.play().catch((err) => {
      console.log('Playback blocked or interrupted:', err);
      setIsPlaying(false);
    });
  };
 
  const togglePlay = () => {
    const audio = audioRef.current;
 
    if (!currentSong && songs.length > 0) {
      playSong(songs[0], songs);
      return;
    }
 
    if (currentSong) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };
 
  const nextSong = () => {
    if (queue.length === 0) return;
    let nextIdx = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : currentIndex + 1 >= queue.length
      ? 0
      : currentIndex + 1;
 
    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
 
    const audio = audioRef.current;
    audio.src = queue[nextIdx].audioUrl;
    audio.currentTime = 0;
    audio.play().catch(() => setIsPlaying(false));
  };
 
  const prevSong = () => {
    if (queue.length === 0) return;
    const audio = audioRef.current;
 
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
 
    let prevIdx = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : currentIndex - 1 < 0
      ? queue.length - 1
      : currentIndex - 1;
 
    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
 
    audio.src = queue[prevIdx].audioUrl;
    audio.currentTime = 0;
    audio.play().catch(() => setIsPlaying(false));
  };
 
  const seek = (time) => {
    const timeNum = Number(time);
    if (isNaN(timeNum)) return;
    audioRef.current.currentTime = timeNum;
    setProgress(timeNum);
  };
 
  const adjustVolume = (val) => {
    const volNum = Number(val);
    if (isNaN(volNum)) return;
    setVolume(volNum);
    setIsMuted(false);
    audioRef.current.volume = volNum;
  };
 
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.volume = nextMuted ? 0 : volume;
  };
 
  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);
 
  const handleTimeUpdate = () => setProgress(audioRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(audioRef.current.duration || 0);
  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      nextSong();
    }
  };
 
  
  const audioState = {
    currentSong, isPlaying, progress, duration, volume, isMuted,
    isShuffle, isRepeat, queue, currentIndex,
    playSong, togglePlay, nextSong, prevSong, seek,
    adjustVolume, toggleMute, toggleShuffle, toggleRepeat,
  };
 
  const isAdmin = currentUser && currentUser.role === 'admin';
 
  return (
    <>
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />
 
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage login={login} signup={signup} />
            )
          }
        />
 
        
        <Route
          path="/"
          element={
            currentUser ? (
              <AppLayout
                currentUser={currentUser}
                likedSongIds={likedSongIds}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                logout={logout}
                audioState={audioState}
                toggleLikeSong={toggleLikeSong}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route
            index
            element={
              <Home
                songs={songs}
                toggleLikeSong={toggleLikeSong}
                likedSongIds={likedSongIds}
                audioState={audioState}
              />
            }
          />
 
          <Route
            path="search"
            element={
              <Search
                songs={songs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                toggleLikeSong={toggleLikeSong}
                likedSongIds={likedSongIds}
                audioState={audioState}
              />
            }
          />
 
          <Route
            path="liked-songs"
            element={
              <LikedSongs
                likedSongIds={likedSongIds}
                getLikedSongs={getLikedSongs}
                toggleLikeSong={toggleLikeSong}
                audioState={audioState}
              />
            }
          />
 
          <Route
            path="admin"
            element={
              isAdmin ? (
                <AdminPanel songs={songs} addSong={addSong} deleteSong={deleteSong} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
 
         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}