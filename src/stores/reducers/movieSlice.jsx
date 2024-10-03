import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  info: null,
  loading: false,
  error: null,
}

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setMovieDetails: (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMovieLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMovieError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.info = null;
    },
    clearMovie: (state) => {
      state.info = null;
      state.error = null;
      state.loading = false;
    },
  },
})

export const { setMovieDetails, setMovieLoading, setMovieError, clearMovie } = movieSlice.actions

export default movieSlice.reducer