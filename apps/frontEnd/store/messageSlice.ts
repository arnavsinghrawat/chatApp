import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StaticImageData } from "next/image";

export interface MessagesState {
  list: {
    _id?: string;
    senderId: string;
    receiverId: string;
    text?: string;
    seen: boolean;
    image?: string | StaticImageData;
    createdAt: string;
  }[];
}

const initialState: MessagesState = {
  list: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessagesState["list"]>) => {
      state.list = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessagesState["list"][number]>) => {
      state.list.push(action.payload);
    },
    clearMessages: (state) => {
      state.list = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
