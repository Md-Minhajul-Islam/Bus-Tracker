import { createSlice } from "@reduxjs/toolkit";

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
  },
  reducers: {
    setUserList: (state, action) => {
      state.users = action.payload;
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((app) => app._id !== action.payload);
    },
  },
});

export const { setUserList, removeUser } = userListSlice.actions;
export default userListSlice.reducer;
