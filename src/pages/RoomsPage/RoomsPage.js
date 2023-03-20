import { useState, useEffect, useRef } from "react";
import { createSocket } from "../../utils/sockets"; // Import createSocket from sockets.js
import { createRoom } from "../../utils/api"; // Import createRoom from api.js
import { useNavigate } from "react-router-dom";
import "./RoomsPage.scss";

function RoomsPage(props) {
  const [rooms, setRooms] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = createSocket(token);

    socketRef.current.emit("joinRoom", "rooms");

    socketRef.current.on("roomList", (rooms) => {
      console.log("Received roomList:", rooms);
      setRooms(rooms);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const navigate = useNavigate();

  const handleRoomSelection = (roomId) => {
    navigate(`/game/${roomId}`);
  };

  const handleCreateRoom = () => {
    const roomId = `room${Math.floor(Math.random() * 10000)}`;

    createRoom(roomId)
      .then(() => {
        handleRoomSelection(roomId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="rooms-page">
      <h1>Rooms Page</h1>
      <div className="rooms-div">
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

    </div>
  );
}

export default RoomsPage;
