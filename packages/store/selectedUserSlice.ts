import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  bio: string;
}

export interface SelectedUserState {
  value: IUser | null;
}

const initialState: SelectedUserState = {
  value: null,
}

export const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<IUser | null>) => {
      state.value = action.payload;
    },
    clearSelectedUser: (state) => {
      state.value = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = selectedUserSlice.actions;

export default selectedUserSlice.reducer;