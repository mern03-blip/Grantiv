import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleGetFavoriteGrants, handleFavoriteGrants } from "../../api/endpoints/grants";

// ✅ Fetch all favorite grants
export const fetchFavoriteGrants = createAsyncThunk(
  "favoriteGrants/fetchFavoriteGrants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await handleGetFavoriteGrants();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch favorites");
    }
  }
);

// ✅ Toggle a single grant (add/remove)
export const toggleFavoriteGrant = createAsyncThunk(
  "favoriteGrants/toggleFavoriteGrant",
  async (grantId, { rejectWithValue }) => {
    try {
      const response = await handleFavoriteGrants(grantId);
      return { grantId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to toggle favorite");
    }
  }
);

// ✅ Selector: check if a grant is already favorite
export const selectIsGrantFavorite = (state, grantId) =>
  state.favoriteGrants.grants.some(
    (g) => g._id === grantId || g.id === grantId
  );


const favoriteGrantSlice = createSlice({
  name: "favoriteGrants",
  initialState: {
    grants: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavoriteGrants: (state) => {
      state.grants = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Fetch favorites
      .addCase(fetchFavoriteGrants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteGrants.fulfilled, (state, action) => {
        state.loading = false;
        state.grants = action.payload || [];
      })
      .addCase(fetchFavoriteGrants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔸 Toggle favorite
      .addCase(toggleFavoriteGrant.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleFavoriteGrant.fulfilled, (state, action) => {
        state.loading = false;
        const { grantId, data } = action.payload;

        // ✅ Optimistic update: add/remove from state instantly
        const exists = state.grants.find((g) => g.id === grantId || g._id === grantId);
        if (exists) {
          state.grants = state.grants.filter((g) => g.id !== grantId && g._id !== grantId);
        } else {
          // Agar response me updated grant object aaye to push kr do
          if (data?.grant) state.grants.push(data.grant);
        }
      })
      .addCase(toggleFavoriteGrant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavoriteGrants } = favoriteGrantSlice.actions;
export default favoriteGrantSlice.reducer;
