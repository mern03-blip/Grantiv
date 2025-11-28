import { configureStore } from "@reduxjs/toolkit";
import favoriteGrantReducer from "./slices/favoriteGrantSlice";
import grantReducer from "./slices/grantSlice";

export const store = configureStore({
  reducer: {
    favoriteGrants: favoriteGrantReducer,
    grants: grantReducer,
  },
});
