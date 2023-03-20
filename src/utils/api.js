// api.js
import axios from "axios";
const SERVER_ADDRESS = "http://localhost:8080";

export function createRoom(roomId) {
  return axios.post(`${SERVER_ADDRESS}/rooms`, { roomId });
}
