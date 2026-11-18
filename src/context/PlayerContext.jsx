import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getValidToken } from '../services/spotifyAuth';
import { normalizeSdkTrack, startPlayback } from '../services/spotify';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user ? user.id : null;

  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playerError, setPlayerError] = useState('');

  useEffect(() => {
    if (!userId) {
      setCurrentSong(null);
      setIsPlaying(false);
      setProgress(0);
      setDeviceId(null);
      return undefined;
    }

    let cancelled = false;
    let player = null;

    const initPlayer = () => {
      if (cancelled) return;

      player = new window.Spotify.Player({
        name: 'Brotify',
        getOAuthToken: (cb) => {
          getValidToken().then((token) => cb(token));
        },
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setPlayerError('');
      });
      player.addListener('not_ready', () => setDeviceId(null));

      player.addListener('player_state_changed', (state) => {
        if (!state) {
          setIsPlaying(false);
          return;
        }
        setCurrentSong(normalizeSdkTrack(state.track_window.current_track));
        setIsPlaying(!state.paused);
        setProgress(state.position / 1000);
        setDuration(state.duration / 1000);
      });

      player.addListener('account_error', () =>
        setPlayerError('Spotify Premium is required to play songs.')
      );
      player.addListener('authentication_error', () =>
        setPlayerError('Spotify login expired. Please log in again.')
      );
      player.addListener('initialization_error', () =>
        setPlayerError('This browser cannot play Spotify music.')
      );

      player.connect();
      playerRef.current = player;
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
      if (!document.getElementById('spotify-sdk')) {
        const script = document.createElement('script');
        script.id = 'spotify-sdk';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (player) player.disconnect();
      playerRef.current = null;
    };
  }, [userId]);

  
  
  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = setInterval(() => {
      setProgress((p) =>
        duration > 0 ? Math.min(p + 0.5, duration) : p + 0.5
      );
    }, 500);

    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const playSong = useCallback(
    async (song, queue = []) => {
      if (!song || !playerRef.current) return;

      if (!deviceId) {
        showToast('Player is still loading. Try again in a moment.', 'error');
        return;
      }

      
      if (currentSong && currentSong.id === song.id) {
        playerRef.current.togglePlay();
        return;
      }

      const list = queue.some((s) => s.id === song.id) ? queue : [song];
      const index = list.findIndex((s) => s.id === song.id);
      const start = Math.max(0, index - 20);
      const uris = list.slice(start, start + 100).map((s) => s.uri);

      
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
      setDuration(song.duration);

      try {
        await playerRef.current.activateElement();
      } catch {
        
      }

      try {
        await startPlayback(deviceId, uris, song.uri);
      } catch (err) {
        setIsPlaying(false);
        showToast(err.message, 'error');
      }
    },
    [deviceId, currentSong, showToast]
  );

  const togglePlay = useCallback(() => {
    if (!currentSong) {
      showToast('Pick a song to play first.', 'error');
      return;
    }

    if (playerRef.current) {
      playerRef.current.togglePlay();
    }
  }, [currentSong, showToast]);

  const adjustVolume = useCallback((val) => {
    const value = Number(val);
    if (isNaN(value)) return;

    setVolume(value);
    setIsMuted(false);

    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (playerRef.current) {
      playerRef.current.setVolume(nextMuted ? 0 : volume);
    }
  }, [isMuted, volume]);

  const value = useMemo(
    () => ({
      currentSong,
      isPlaying,
      progress,
      duration,
      volume,
      isMuted,
      playerError,
      playSong,
      togglePlay,
      adjustVolume,
      toggleMute,
    }),
    [
      currentSong,
      isPlaying,
      progress,
      duration,
      volume,
      isMuted,
      playerError,
      playSong,
      togglePlay,
      adjustVolume,
      toggleMute,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
