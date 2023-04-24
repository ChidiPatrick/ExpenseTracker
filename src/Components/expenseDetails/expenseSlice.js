import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
const initialState = {
  expenseArray: [],
  expenseTotal: 0,
  expenseObj: [],
  displayEditUI: false,
};

export const GetExpenseArray = createAsyncThunk(
  "expense/getExpense",
  async (userId, { dispatch, getState }) => {
    const expenseRef = doc(
      db,
      "users",
      `${userId}`,
      `expenseCollection`,
      `expenses`
    );
    const expenses = await getDoc(expenseRef);
    if (expenses.exists()) {
      dispatch(getExpenses(expenses.data()));
    }
  }
);
const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    getExpenseObj(state, action) {
      state.expenseArray = [...state.expenseArray, action.payload];
    },
    addExpense(state, action) {
      state.expenseTotal = (
        parseInt(state.expenseTotal) + parseInt(action.payload)
      ).toFixed(2);
    },
    updateExpenseArray(state, action) {
      state.expenseArray = action.payload;
    },
    getExpenses(state, action) {
      state.expenseObj = action.payload;
    },
    showEditUI(state, action) {
      state.displayEditUI = true;
    },
    hideEditUI(state, action) {
      state.displayEditUI = false;
    },
  },
});
export const {
  getExpenseObj,
  addExpense,
  updateExpenseArray,
  getExpenses,
  hideEditUI,
  showEditUI,
} = expenseSlice.actions;
export default expenseSlice.reducer;
