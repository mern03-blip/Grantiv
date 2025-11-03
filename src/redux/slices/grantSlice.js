import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  aiTotalAmount: 0, // from AIRecommendedGrants
};

const grantSlice = createSlice({
  name: 'grants',
  initialState,
  reducers: {
    // for setting total amount from AI Recommended component
    setAiTotalAmount: (state, action) => {
      state.aiTotalAmount = action.payload;
    },
  },
});

export const { setAiTotalAmount } = grantSlice.actions;
export default grantSlice.reducer;
