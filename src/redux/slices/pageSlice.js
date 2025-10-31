// import { createSlice } from "@reduxjs/toolkit";

// // Initial state
// const initialState = {
//   currentPage: 1,
//   lastVisible: null,
//   firstVisible: null,
// };

// const pageSlice = createSlice({
//   name: "page",
//   initialState,
//   reducers: {
//     setPage: (state, action) => {
//       state.currentPage = action.payload.currentPage;
//       state.lastVisible = action.payload.lastVisible;
//       state.firstVisible = action.payload.firstVisible;
//     },
//     resetPage: (state) => {
//       state.currentPage = 1;
//       state.lastVisible = null;
//     },
//   },
// });

// // Actions
// export const { setPage, resetPage } = pageSlice.actions;

// // Selectors
// export const selectPage = (state) => state.page;

// // Reducer
// export default pageSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  lastVisible: null,
  firstVisible: null,
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
      state.lastVisible = action.payload.lastVisible;
      state.firstVisible = action.payload.firstVisible;
    },
    resetPage: (state) => {
      state.currentPage = 1;
      state.lastVisible = null;
      state.firstVisible = null;
    },
  },
});

export const { setPage, resetPage } = pageSlice.actions;
export const selectPage = (state) => state.page;
export default pageSlice.reducer;
