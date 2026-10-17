import React, { useState } from 'react';
import logoIcon from '../assets/icons/logo.svg';

export default function AuthPage({ login, signup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields!');
      return;
    }

    const res = isLogin ? login(username, password) : signup(username, password);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="glass-card animate-fade-in">

        <div style={logoWrapperStyle}>
          <img src={logoIcon} alt="Brotify" width="50" height="50" />
          <span style={logoTextStyle}>Brotify</span>
        </div>

        <h2 style={titleStyle}>{isLogin ? 'Log in to continue' : 'Sign up for free'}</h2>

        {errorMessage && (
          <div style={errorBannerStyle}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={submitBtnStyle} className="transition-all">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={dividerStyle} />

        <div style={footerStyle}>
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={toggleForm} style={toggleBtnStyle} className="transition-all">
            {isLogin ? 'Sign up for Brotify' : 'Log in here'}
          </button>
        </div>

        <div style={demoAccountPanelStyle}>
          <div style={demoHeaderStyle}>Demo Credentials</div>
          <div style={demoRowStyle}>
            <span style={{fontWeight: '700'}}>Admin Login:</span>
            <span style={{color: '#F4A340'}}>admin / admin123</span>
          </div>
          <div style={demoRowStyle}>
            <span style={{fontWeight: '700'}}>User Signup:</span>
            <span style={{color: '#9FB3CE'}}>Create any user account!</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styling
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: '#0F1E36',
  backgroundImage: 'radial-gradient(circle at top right, rgba(244, 163, 64, 0.18), transparent 60%)',
};

const cardStyle = {
  width: '420px',
  padding: '40px 32px',
  borderRadius: '12px',
  boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
};

const logoWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '24px',
};

const logoTextStyle = {
  fontSize: '1.8rem',
  fontWeight: '800',
  letterSpacing: '-1px',
};

const titleStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  marginBottom: '24px',
  color: '#fff',
  letterSpacing: '-0.3px',
};

const errorBannerStyle = {
  backgroundColor: 'rgba(255, 77, 77, 0.12)',
  border: '1px solid #ff4d4d',
  color: '#ff9999',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '0.82rem',
  fontWeight: '600',
  marginBottom: '20px',
  textAlign: 'left',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left',
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#9FB3CE',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  backgroundColor: '#16294A',
  border: '1px solid transparent',
  borderRadius: '10px',
  color: '#fff',
  padding: '12px 14px',
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  transition: 'border-color 0.2s',
};

const submitBtnStyle = {
  backgroundColor: '#F4A340',
  color: '#000',
  border: 'none',
  padding: '14px',
  borderRadius: '30px',
  fontSize: '0.9rem',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '10px',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: '#2A4166',
  margin: '24px 0',
};

const footerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '0.85rem',
  color: '#9FB3CE',
};

const toggleBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '600',
  padding: '4px',
};

const demoAccountPanelStyle = {
  marginTop: '24px',
  backgroundColor: '#1b1b1b',
  borderRadius: '12px',
  padding: '12px',
  fontSize: '0.8rem',
  textAlign: 'left',
  border: '1px solid #2A4166',
};

const demoHeaderStyle = {
  fontWeight: '700',
  color: '#9FB3CE',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  fontSize: '0.72rem',
};

const demoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '4px',
};
