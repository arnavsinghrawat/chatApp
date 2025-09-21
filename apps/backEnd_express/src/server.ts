import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db";
import userRouter from "./routes/userRoutes";
import messageRouter from "./routes/messageRoutes";
import { Server, Socket } from "socket.io";

const app: Express = express();
const server = http.createServer(app);


export interface ServerToClientEvents {
  getOnlineUsers: (users: string[]) => void;
  newMessage: (message: {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
  }) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: {
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
  }) => void;
}

interface InterServerEvents { }

interface SocketData {
  userId?: string;
}


export const userSocketMap: Record<string, string> = {};

export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  const userId = socket.handshake.query.userId as string | undefined;
  console.log("User Connected", userId);
  console.log("Socket room --> ",socket.rooms)

  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.data.userId = userId;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", () => {
    
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});


app.use(express.json({ limit: '4mb' }));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("/api/status", (req: Request, res: Response) => {
  return res.send("server is live\n");
});

app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

connectDB();

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));