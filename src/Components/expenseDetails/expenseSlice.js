import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  expenseArray: [],
  expenseTotal: 0,
};
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
  },
});
export const { getExpenseObj, addExpense, updateExpenseArray } =
  expenseSlice.actions;
export default expenseSlice.reducer;
