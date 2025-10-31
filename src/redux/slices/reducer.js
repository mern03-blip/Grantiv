import { combineReducers } from "@reduxjs/toolkit";
import pageReducer from "./pageSlice";

const appReducer = combineReducers({
  page:pageReducer
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
