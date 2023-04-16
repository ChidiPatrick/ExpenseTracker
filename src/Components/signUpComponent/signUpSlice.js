import React from "react";
import { createSlice } from "@reduxjs/toolkit";
/////////////////////////////////////////////////////
const initialState = {
  userId: "",
};
const signUpSlice = createSlice({
  name: "signUpSlice",
  initialState,
  reducers: {
    getUserId(state, action) {
      state.userId = action.payload;
    },
  },
});
export const { getUserId } = signUpSlice.actions;
export default signUpSlice.reducer;
