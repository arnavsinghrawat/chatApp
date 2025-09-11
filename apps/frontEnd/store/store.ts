import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from './selectedUserSlice';
import uiReducer from './uiSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        selectedUser: selectedUserReducer,
        ui: uiReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;