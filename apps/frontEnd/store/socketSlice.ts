import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
    socket: Socket | null;
    onlineUsers: string[];
}

const initialState: SocketState = {
    socket: null,
    onlineUsers: [],
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<Socket>) => {
            return {
                ...state,
                socket: action.payload,
            };
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const setSocket: (payload: Socket) => PayloadAction<Socket> = socketSlice.actions.setSocket;
export const setOnlineUsers: (payload: string[]) => PayloadAction<string[]> = socketSlice.actions.setOnlineUsers;
export default socketSlice.reducer;
