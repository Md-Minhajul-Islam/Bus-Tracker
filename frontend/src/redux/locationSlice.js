import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    allLocations: [],
  },
  reducers: {
    setLocation: (state, action) => {
      state.allLocations = action.payload;
    },
    updateLocation: (state, action) => {
      const { sender, locations } = action.payload;

      const existing = state.allLocations.find(
        (item) => item?.sender?._id === sender?._id,
      );

      if (existing) {
        existing.locations = locations;
      } else {
        state.allLocations.push(action.payload);
      }
    },
    removeLocation: (state, action) => {
      state.allLocations = state.allLocations.filter(
        (item) => item?.sender?._id !== action.payload,
      );
    },
  },
});

export const { setLocation, updateLocation, removeLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
