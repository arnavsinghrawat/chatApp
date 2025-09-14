import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./selectedUserSlice";

export interface AuthState {
    token: string | null;
    authUser: IUser | null;
}

const initialState: AuthState = {
    token: null,
    authUser: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string, user: any }>) => {
            state.token = action.payload.token;
            state.authUser = action.payload.user;
        },
        clearAuth: (state) => {
            state.token = null;
            state.authUser = null;
        },
        hydrateAuth: (state, action: PayloadAction<{ token: string; user: any }>) => {
            state.token = action.payload.token;
            state.authUser = action.payload.user;
        }

    }
});

export const { setAuth, clearAuth, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;