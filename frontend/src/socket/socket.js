import { io } from "socket.io-client";
import { API_END_POINT } from "../utils/constants";

export const socket = io(API_END_POINT, {
  withCredentials: true,
  autoConnect: false,
});
