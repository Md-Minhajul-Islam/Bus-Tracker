import { createSlice } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    routes: [],
  },
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
    addRoute: (state, action) => {
      state.routes.push(action.payload);
    },
    updateRoute: (state, action) => {
      const updated = action.payload;
      state.routes = state.routes.map((r) =>
        r._id === updated._id ? updated : r,
      );
    },
    removeRoute: (state, action) => {
      state.routes = state.routes.filter((r) => r._id !== action.payload);
    },
  },
});

export const {
  setRoutes,
  addRoute,
  updateRoute,
  removeRoute,
} = routeSlice.actions;

export default routeSlice.reducer;
