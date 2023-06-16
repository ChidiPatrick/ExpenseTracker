import React from "react";
import { createSlice } from "@reduxjs/toolkit";
/////////////////////////////////////////////////////
const initialState = {
  userId: "",
  categoryFromEditUI: false,
  categoryChanged: false,
};
const signUpSlice = createSlice({
  name: "signUpSlice",
  initialState,
  reducers: {
    getUserId(state, action) {
      state.userId = action.payload;
    },
    setCategoryFromEditUI(state, action) {
      state.categoryFromEditUI = true;
    },
    resetCategoryFromEditUI(state, action) {
      state.categoryFromEditUI = false;
    },
    setCategoryChanged(state, action) {
      state.categoryChanged = action.payload;
    },
  },
});
export const {
  getUserId,
  resetCategoryFromEditUI,
  setCategoryFromEditUI,
  setCategoryChanged,
} = signUpSlice.actions;
export default signUpSlice.reducer;
