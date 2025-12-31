import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./authSlice";
import locationSlice from "./locationSlice";
import messageSlice from "./messageSlice";
import userApplicationSlice from "./userApplicationSlice";
import userListSlice from "./userListSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const appReducer = combineReducers({
  auth: authSlice,
  location: locationSlice,
  message: messageSlice,
  userApplication: userApplicationSlice,
  userList: userListSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    storage.removeItem("persist:root");
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export default store;
