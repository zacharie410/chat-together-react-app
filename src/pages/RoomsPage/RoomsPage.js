import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SERVER_ADDRESS = 'http://localhost:8080';

function RoomsPage(props) {
    const [rooms, setRooms] = useState([]);


  const socketRef = useRef();


  useEffect(() => {

    const token = localStorage.getItem('token');
    socketRef.current = io(`${SERVER_ADDRESS}`, {
      transports: ['websocket'],
      query: { token: token }
    });

    socketRef.current.emit('joinRoom', 'rooms');


    socketRef.current.on('roomList', (rooms) => {
      console.log('Received roomList:', rooms);
      setRooms(rooms);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const navigate = useNavigate();

  const handleRoomSelection = (roomId) => {
  
    socketRef.current.emit('joinRoom', roomId);
  

  
    navigate(`/game/${roomId}`);
  };
  


const handleCreateRoom = () => {
    // Replace this with your desired roomId generation logic
    const roomId = `room${Math.floor(Math.random() * 10000)}`;
  
    axios
      .post(`${SERVER_ADDRESS}/rooms`, { roomId })
      .then(() => {
        handleRoomSelection(roomId);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div>
      <h1>Rooms Page</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
      <ul>
      {rooms.filter((room) => room !== "rooms")
        .map((room) => (
            <li key={room}>
            {room}
            <button onClick={() => handleRoomSelection(room)}>Join</button>
            </li>
        ))}


      </ul>
        <button onClick={props.onLogout}>Logout</button>
    </div>
  );
}

export default RoomsPage;
