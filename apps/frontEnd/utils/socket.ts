import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Initialize socket (singleton)
export const initSocket = (token: string, userId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URI as string, {
      auth: { token },
      query: { userId },
    });
  }
  return socket;
};

// Get existing socket
export const getSocket = (): Socket | null => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Subscribe to online users event
export const subscribeToOnlineUsers = (callback: (users: string[]) => void) => {
  if (socket) socket.on("getOnlineUsers", callback);
};

// Unsubscribe from online users
export const unsubscribeFromOnlineUsers = () => {
  if (socket) socket?.off("getOnlineUsers");
};

// Subscribe to new messages
export const subscribeToNewMessages = (callback: (message: any) => void) => {
  if (socket) socket.on("newMessage", callback);
};

// Unsubscribe from new messages
export const unsubscribeFromNewMessages = () => {
  if (socket) socket?.off("newMessage");
};

// Send message via socket
export const sendMessageViaSocket = (receiverId: string, text?: string, image?: string) => {
  if (socket) {
    socket.emit("sendMessage", { receiverId, text, image });
  }
};
