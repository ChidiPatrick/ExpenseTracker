import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";

const initialState = {
  currCategory: "",
  categoriesArray: [],
  chartColor: "",
  selectedCategoryEmoji: "",
  displayEmoji: false,
  displayColorPicker: false,
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
    setChartColor(state, action) {
      state.chartColor = action.payload;
    },
    setCategoryEmoji(state, action) {
      state.selectedCategoryEmoji = action.payload;
    },
    resetSelectedCategoryColor(state, action) {
      state.chartColor = "#fff";
    },
    resetSelectedCategoryEmoji(state, action) {
      state.selectedCategoryEmoji = "";
    },
    showEmoji(state, action) {
      state.displayEmoji = true;
    },
    hideEmoji(state, action) {
      state.displayEmoji = false;
    },
    showColorPicker(state, action) {
      state.displayColorPicker = true;
    },
    hideColorPicker(state, action) {
      state.displayColorPicker = false;
    },
  },
});
export const {
  getSelectedCategory,
  getCategories,
  setChartColor,
  setCategoryEmoji,
  resetSelectedCategoryColor,
  resetSelectedCategoryEmoji,
  showEmoji,
  hideEmoji,
  showColorPicker,
  hideColorPicker,
} = CategorySlice.actions;
export default CategorySlice.reducer;
