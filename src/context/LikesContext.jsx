import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [likedSongs, setLikedSongs] = useState([]);

 
  const storageKey = user ? `brotify_liked_${user.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setLikedSongs([]);
      return;
    }
    try {
      setLikedSongs(JSON.parse(localStorage.getItem(storageKey)) || []);
    } catch {
      setLikedSongs([]);
    }
  }, [storageKey]);

  const likedIds = useMemo(() => new Set(likedSongs.map((s) => s.id)), [likedSongs]);

  const isLiked = useCallback((songId) => likedIds.has(songId), [likedIds]);

  const toggleLikeSong = useCallback(
    (song) => {
      if (!storageKey) return;
      const alreadyLiked = likedSongs.some((s) => s.id === song.id);

      const updated = alreadyLiked
        ? likedSongs.filter((s) => s.id !== song.id)
        : [
            {
              id: song.id,
              uri: song.uri,
              title: song.title,
              artist: song.artist,
              coverUrl: song.coverUrl,
              duration: song.duration,
            },
            ...likedSongs,
          ];

      setLikedSongs(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      showToast(alreadyLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs');
    },
    [likedSongs, storageKey, showToast]
  );

  const value = useMemo(
    () => ({ likedSongs, isLiked, toggleLikeSong }),
    [likedSongs, isLiked, toggleLikeSong]
  );

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export const useLikes = () => useContext(LikesContext);
