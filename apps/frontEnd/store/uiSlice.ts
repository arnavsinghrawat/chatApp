import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UiState{
    curState: boolean,
};

const initialState: UiState = {
    curState: true
};

export const UiSlice = createSlice({
    name:'ui',
    initialState,
    reducers: {
        toggleCurState: (state) => {
            state.curState = !state.curState;
        },
        setCurState: (state, action: PayloadAction<boolean>) => {
            state.curState = action.payload;
        },
    }
});

export const {toggleCurState, setCurState} = UiSlice.actions

export default UiSlice.reducer