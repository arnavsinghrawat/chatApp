import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  onlineUsers: string[];
}

const initialState: SocketState = {
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    clearSocket: (state) => {
      state.onlineUsers = [];
    },
  },
});

export const { setOnlineUsers, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
