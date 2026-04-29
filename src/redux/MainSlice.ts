import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MainState {
  apiLoading: boolean;
}

const initialState: MainState = {
  apiLoading: false,
};

export const MainSlice = createSlice({
  name: 'main',
  initialState,

  reducers: {
    setApiLoading: (state, action: PayloadAction<boolean>) => {
      state.apiLoading = action.payload;
    },
  },
  extraReducers: () => {}
    
});

export const { setApiLoading } =
  MainSlice.actions;

export default MainSlice;
