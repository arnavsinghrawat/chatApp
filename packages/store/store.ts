import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from './selectedUserSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        selectedUser: selectedUserReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;