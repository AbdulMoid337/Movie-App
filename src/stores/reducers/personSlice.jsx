import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  info: null,
  loading: false,
  error: null,
}

export const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    setPersonDetails: (state, action) => {
      state.info = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPersonLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setPersonError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.info = null;
    },
    clearPerson: (state) => {
      state.info = null;
      state.error = null;
      state.loading = false;
    },
  },
})

export const { setPersonDetails, setPersonLoading, setPersonError, clearPerson } = personSlice.actions

export default personSlice.reducer