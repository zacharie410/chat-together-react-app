import React, { useState, useEffect } from 'react';

function LoginPage({ handleAnonymousLogin, setUsername }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <div>
      <h2>Login Page</h2>
      {!token && (
        <input
          type="text"
          placeholder="Enter username (optional)"
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <button onClick={handleAnonymousLogin}>
        {token ? `Login as ${localStorage.getItem('username')}` : 'Anonymous Login'}
      </button>
    </div>
  );
}

export default LoginPage;
