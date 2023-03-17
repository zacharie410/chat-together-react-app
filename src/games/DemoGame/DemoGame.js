import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

function DemoGame(props) {
  const socketRef = props.socketRef;
  const canvasRef = useRef(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const roomId = props.roomId;
    console.log('Game socket connected');

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const playerSize = 20;

    console.log('draw');
    const drawPlayers = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const username in players) {
        const player = players[username];
        context.fillStyle = player.color;
        context.fillRect(player.x, player.y, playerSize, playerSize);
      }
    };

    const updatePlayerPosition = (direction) => {
        console.log('updatePlayerPosition', direction, roomId);
      socketRef.current.emit('updatePlayerPosition', roomId, direction);
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          updatePlayerPosition('up');
          break;
        case 'ArrowDown':
          updatePlayerPosition('down');
          break;
        case 'ArrowLeft':
          updatePlayerPosition('left');
          break;
        case 'ArrowRight':
          updatePlayerPosition('right');
          break;
        default:
          break;
      }
    };

    socketRef.current.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      console.log('received update req')
      drawPlayers();
    });

    // Fetch the initial state of the players
    socketRef.current.emit('getPlayers', roomId);
    socketRef.current.once('updatePlayers', (initialPlayers) => {
      setPlayers(initialPlayers);
      drawPlayers();
    });

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socketRef.current.off('updatePlayers');
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="gameFrame">
        <canvas ref={canvasRef} width="800" height="600"></canvas>
      </div>
    </div>
  );
}

export default DemoGame;
