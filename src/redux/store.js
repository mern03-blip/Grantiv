// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import rootReducer from "../reduxSlices/reducer";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           "persist/PERSIST",
//           "persist/REHYDRATE",
//           "persist/PAUSE",
//           "persist/FLUSH",
//           "persist/PURGE",
//           "persist/REGISTER",
//         ],
//       },
//     }),
// });

// export const persistedStore = persistStore(store);


import { configureStore } from "@reduxjs/toolkit";
import favoriteGrantReducer from "./slices/favoriteGrantSlice";

export const store = configureStore({
  reducer: {
    favoriteGrants: favoriteGrantReducer,
  },
});
