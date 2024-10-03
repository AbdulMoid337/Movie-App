import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  info: null,
  loading: false,
  error: null,
}

export const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    setTvDetails: (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTvLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTvError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.info = null;
    },
    clearTv: (state) => {
      state.info = null;
      state.error = null;
      state.loading = false;
    },
  },
})

export const { setTvDetails, setTvLoading, setTvError, clearTv } = tvSlice.actions

export default tvSlice.reducer