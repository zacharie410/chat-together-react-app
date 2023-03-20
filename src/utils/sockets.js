// sockets.js
import io from "socket.io-client";
const SERVER_ADDRESS = "http://localhost:8080";

export function createSocket(token) {
  return io(`${SERVER_ADDRESS}`, {
    transports: ["websocket"],
    query: { token: token },
  });
}
