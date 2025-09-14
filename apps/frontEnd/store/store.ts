import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from './selectedUserSlice';
import socketReducer from './socketSlice';
import authReducer from './authSlice';
import messageReducer from './messageSlice'

export const store = configureStore({
    reducer: {
        selectedUser: selectedUserReducer,
        auth: authReducer,
        socket: socketReducer,
        message: messageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;