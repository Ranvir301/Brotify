import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const handled = useRef(false); 

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = searchParams.get('code');
    const spotifyError = searchParams.get('error');

    if (spotifyError || !code) {
      setErrorMessage(
        spotifyError === 'access_denied'
          ? 'You cancelled the Spotify login.'
          : 'Spotify did not send a login code.'
      );
      return;
    }

    completeLogin(code)
      .then((user) => {
        if (user) {
          navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
        } else {
          setErrorMessage(
            'Login failed. If this is not your own app, ask the owner to add your Spotify account under User Management in the Spotify Developer Dashboard.'
          );
        }
      })
      .catch((err) => setErrorMessage(err.message));
  }, [searchParams, completeLogin, navigate]);

  return (
    <div style={containerStyle}>
      {errorMessage ? (
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={errorBannerStyle}>{errorMessage}</div>
          <button style={buttonStyle} onClick={() => navigate('/login', { replace: true })}>
            Back to login
          </button>
        </div>
      ) : (
        <div style={{ color: '#9FB3CE', fontWeight: '600' }}>Logging you in with Spotify...</div>
      )}
    </div>
  );
}

// Styling
const containerStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0F1E36',
};

const errorBannerStyle = {
  backgroundColor: 'rgba(255, 77, 77, 0.12)',
  border: '1px solid #ff4d4d',
  color: '#ff9999',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '20px',
  textAlign: 'left',
};

const buttonStyle = {
  backgroundColor: '#F4A340',
  color: '#000',
  border: 'none',
  padding: '12px 28px',
  borderRadius: '24px',
  fontSize: '0.9rem',
  fontWeight: '700',
  cursor: 'pointer',
};
