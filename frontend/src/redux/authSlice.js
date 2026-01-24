import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    userLocation: null,
    route: null,
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
    },
    setRoute: (state, action) => {
      state.route = action.payload; 
    }
  },
});
export const { setLoading, setUser, setUserLocation, setRoute } = authSlice.actions;
export default authSlice.reducer;
