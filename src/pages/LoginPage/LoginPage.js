import React, { useState, useEffect } from 'react';
import './LoginPage.scss'

function LoginPage({ handleAnonymousLogin, setUsername }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <div className="login-page">
      <h1>CHAT-TOGETHER</h1>
      <div className="login-page-form">
        {!token && (
          <input
            type="text"
            placeholder="Enter nickname"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <button onClick={handleAnonymousLogin}>
          {token ? `CHAT AS ${localStorage.getItem('username')}` : 'CHAT'}
        </button>
      </div>

    </div>
  );
}

export default LoginPage;
