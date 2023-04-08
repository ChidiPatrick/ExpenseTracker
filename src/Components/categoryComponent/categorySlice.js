import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currCategory: "",
};
const CategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getSelectedCategory(state, action) {
      state.currCategory = action.payload;
      console.log(`Current category is: ${state.currCategory}`);
    },
  },
});
export const { getSelectedCategory } = CategorySlice.actions;
export default CategorySlice.reducer;
