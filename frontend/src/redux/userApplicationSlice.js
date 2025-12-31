import { createSlice } from "@reduxjs/toolkit";

const userApplicationSlice = createSlice({
  name: "userApplication",
  initialState: {
    applications: [],
  },
  reducers: {
    setUserApplication: (state, action) => {
      state.applications = action.payload;
    },
    removeUserApplication: (state, action) => {
      state.applications = state.applications.filter(
        (app) => app._id !== action.payload
      );
    },
  },
});

export const { setUserApplication, removeUserApplication } = userApplicationSlice.actions;
export default userApplicationSlice.reducer;
