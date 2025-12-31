import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    userLocation: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    }
  },
});
export const { setLoading, setUser, setUserLocation } = authSlice.actions;
export default authSlice.reducer;
