"use client";

import { io, type Socket } from "socket.io-client";
import { SOCKET_ORIGIN, getAccessToken } from "./api";

let socket: Socket | null = null;

/**
 * Lazily create a single shared Socket.io connection authenticated with the
 * logged-in customer's access token. Returns null if there is no token or no
 * configured origin (the chat widget falls back to REST polling in that case).
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token || !SOCKET_ORIGIN) return null;
  if (!socket) {
    socket = io(SOCKET_ORIGIN, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
    });
  }
  return socket;
}

/** Tear down the shared socket (call on logout so the next user gets a fresh, correctly-authed connection). */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
