import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";

const initialState = {
  currCategory: "",
  categoriesArray: [],
};
export const GetCategories = createAsyncThunk(
  "category/getCategories",
  async (userId, { dispatch, getState }) => {
    const categoryRef = doc(
      db,
      "users",
      `${userId}`,
      `categoryCollection`,
      `categories`
    );
    const categories = await getDoc(categoryRef);
    if (categories.exists()) {
      dispatch(getCategories(categories.data()));
    }
  }
);
const CategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getSelectedCategory(state, action) {
      state.currCategory = action.payload;
    },
    getCategories(state, action) {
      state.categoriesArray = action.payload;
    },
  },
});
export const { getSelectedCategory, getCategories } = CategorySlice.actions;
export default CategorySlice.reducer;
