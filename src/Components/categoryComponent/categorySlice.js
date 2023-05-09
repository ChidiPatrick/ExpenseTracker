import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";

const initialState = {
  currCategory: "",
  categoriesArray: undefined,
  chartColor: "",
  selectedCategoryEmoji: "",
  displayEmoji: false,
  displayColorPicker: false,
  onTransactionUI: false,
  onCategoryUI: false,
  totalExpense: 0,
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
export const getTotalExpenses = createAsyncThunk(
  "expenseTotal/getExpenseTotal",
  async (userId, { dispatch, getState }) => {
    const totalExpenseRef = doc(
      db,
      "users",
      `${userId}`,
      `salaryCollection`,
      `salaries`
    );
    const salariesObj = await getDoc(totalExpenseRef);
    if (salariesObj.exists()) {
      console.log(salariesObj.data().totalExpense);
      dispatch(getTotalExpense(salariesObj.data().totalExpense));
    } else {
      console.log("ref does not exist");
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
    activateOnTransactionUI(state, action) {
      state.onTransactionUI = true;
    },
    deactivateOnTransactionUI(state, action) {
      state.onTransactionUI = false;
    },
    activateOnCategoryUI(state, action) {
      state.onCategoryUI = true;
    },
    deactivateOnCategoryUI(state, action) {
      state.onCategoryUI = false;
    },
    getTotalExpense(state, action) {
      state.totalExpense = action.payload;
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
  activateOnCategoryUI,
  deactivateOnCategoryUI,
  activateOnTransactionUI,
  deactivateOnTransactionUI,
  getTotalExpense,
} = CategorySlice.actions;
export default CategorySlice.reducer;
