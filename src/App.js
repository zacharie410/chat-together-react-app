import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.js';
import RoomsPage from './pages/RoomsPage/RoomsPage.js';
import GamePage from './pages/GamePage/GamePage.js';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const SERVER_ADDRESS = 'http://localhost:8080';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);


  const socketRef = useRef(null);
  
  const handleAnonymousLogin = () => {
    if (isLoggingIn) return;
    if (checkExistingToken()) return;
    setIsLoggingIn(true);

    const chosenUsername = username.trim() || 'anonymous';

    axios.post(`${SERVER_ADDRESS}/login`, {
      username: chosenUsername,
      password: ''
    })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', chosenUsername); // Store the username
        setIsLoggedIn(true);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.disconnect();
      setSocketConnected(false);
    }
  };

  
  const checkExistingToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      return axios
        .get(`${SERVER_ADDRESS}/check-token`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          if (response.data.valid) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
            return true
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');

          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    //checkExistingToken();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !socketConnected) {
      socketRef.current = io(`${SERVER_ADDRESS}`, {
        transports: ['websocket'],
        query: { token: token }
      });
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
        setConnectionStatus('Connected to server');
        setSocketConnected(true);
      });
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnectionStatus('Disconnected from server');
        setSocketConnected(false);
      });
    }
  }, [isLoggedIn, socketConnected]);


return (
  <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <RoomsPage onLogout={handleLogout}/>
             : <LoginPage handleAnonymousLogin={handleAnonymousLogin} setUsername={setUsername} />}
        />
        <Route path="/game/:roomId" element={
            isLoggedIn ? <GamePage socketRef={socketRef} messages={messages} setMessages={setMessages}  />
            : <LoginPage handleAnonymousLogin={handleAnonymousLogin} setUsername={setUsername} />} />
      </Routes>
  </Router>
);
}

export default App;