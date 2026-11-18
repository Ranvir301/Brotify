// Spotify login using the Authorization Code + PKCE flow (safe for front-end only apps)

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/callback';
const SCOPES =
  'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const ACCESS_KEY = 'spotify_access_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRES_KEY = 'spotify_expires_at';
const VERIFIER_KEY = 'spotify_code_verifier';

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join('');
}

function base64Url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function saveTokens(data) {
  localStorage.setItem(ACCESS_KEY, data.access_token);
  if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
  localStorage.setItem(EXPIRES_KEY, String(Date.now() + data.expires_in * 1000));
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(VERIFIER_KEY);
}

export function hasSession() {
  return Boolean(localStorage.getItem(REFRESH_KEY));
}


export async function loginWithSpotify() {
  if (!CLIENT_ID) {
    throw new Error(
      'Missing VITE_SPOTIFY_CLIENT_ID. Add it to your .env file and restart the dev server.'
    );
  }

  const verifier = randomString(64);
  localStorage.setItem(VERIFIER_KEY, verifier);

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: base64Url(digest),
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}


export async function exchangeCode(code) {
  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!verifier) {
    throw new Error('Login session expired. Please start the login again.');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error('Could not complete the Spotify login. Please try again.');

  saveTokens(await res.json());
  localStorage.removeItem(VERIFIER_KEY);
}

let refreshing = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;

  
  if (!refreshing) {
    refreshing = fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          clearTokens();
          return null;
        }
        const data = await res.json();
        saveTokens(data);
        return data.access_token;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}


export async function getValidToken() {
  const token = localStorage.getItem(ACCESS_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (token && Date.now() < expiresAt - 60000) return token;
  return refreshAccessToken();
}
