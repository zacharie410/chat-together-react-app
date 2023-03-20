import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GamePage.scss";

function GamePage({ socketRef }) {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    console.log("Joining room: " + roomId);
    socketRef.current.emit("joinRoom", roomId); // Join the room with roomId
    socketRef.current.off("newMessage");
    socketRef.current.on("newMessage", (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    });
  }, [roomId]);
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socketRef.current.emit("sendMessage", roomId, message);

      setMessage("");
    }
  };

  const handleLeaveRoom = () => {
    //redirect to home directory
    window.location.href = "/";
    socketRef.current.emit("leaveRoom", roomId);
  };
  /*<div className="gameFrame">
            <canvas ref={canvasRef} width="800" height="600"></canvas>
          </div>*/
  return (
    <div className="chat-page">
      <h1>Chat Page</h1>
      <h2>{roomId}</h2>
      <button className="chat-leave" onClick={handleLeaveRoom}>
        Leave Room
      </button>

      <div className="chat-div">
        <input
          type="text"
          value={message}
          name="chat"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button className="chat-send" onClick={handleSendMessage}>
        Send
      </button>

      <ul className="messages">
        {messages.map((m, index) => (
          <li className="msg" key={index}>
            <strong>{m.username}:</strong> {m.text.substring(0, 50)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamePage;
