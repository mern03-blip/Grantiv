import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedGrants: [],
  favoriteProjects: [], // Add favoriteProjects to store
  isLoading: false,
};

const favoriteGrantSlice = createSlice({
  name: "favoriteGrants",
  initialState,
  reducers: {
    setSavedGrants: (state, action) => {
      state.savedGrants = action.payload;
    },
    setFavoriteProjects: (state, action) => {
      state.favoriteProjects = action.payload;
    },
    toggleFavoriteGrant(state, action) {
      const grant = action.payload;
      const exists = state.items.some(g => g._id === grant._id);
      state.items = exists
        ? state.items.filter(g => g._id !== grant._id)
        : [...state.items, grant];
    },
    addFavoriteGrant: (state, action) => {
      state.savedGrants.push(action.payload);
    },
    removeFavoriteGrant: (state, action) => {
      state.savedGrants = state.savedGrants.filter(
        (g) => g._id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSavedGrants,
  setFavoriteProjects,
  addFavoriteGrant,
  removeFavoriteGrant,
  setLoading,
} = favoriteGrantSlice.actions;

export default favoriteGrantSlice.reducer;
