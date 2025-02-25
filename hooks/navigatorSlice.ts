import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigatorState {
  currentPosition: number;
}

const initialState: NavigatorState = {
  currentPosition: 0,
};

const navigatorSlice = createSlice({
  name: "navigator",
  initialState,
  reducers: {
    setCurrentPosition: (state, action: PayloadAction<number>) => {
      state.currentPosition = action.payload;
    },
  },
});

export const { setCurrentPosition } = navigatorSlice.actions;
export default navigatorSlice.reducer;
