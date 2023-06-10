import React from "react";
import { createSlice } from "@reduxjs/toolkit";
/////////////////////////////////////////////////////
const initialState = {
  userId: "",
  categoryFromEditUI: false,
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
  },
});
export const { getUserId, resetCategoryFromEditUI, setCategoryFromEditUI } =
  signUpSlice.actions;
export default signUpSlice.reducer;
