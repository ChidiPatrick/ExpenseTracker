import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
const initialState = {
  expenseArray: [],
  expenseTotal: 0,
  expenseObj: [],
  displayEditUI: false,
  salary: 0,
  salaryBalance: 0,
  showFeedBackUI: false,
  selectedTransaction: {},
  spendingPercentage: 0,
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
export const GetSalary = createAsyncThunk(
  "salary/getSalary",
  async (userId, { dispatch, getState }) => {
    const salaryRef = doc(
      db,
      "users",
      `${userId}`,
      `salaryCollection`,
      `salaries`
    );
    const salary = await getDoc(salaryRef);
    if (salary.exists()) {
      console.log(salary.data());
      dispatch(getSalary(salary.data()));
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
    getSalary(state, action) {
      state.salary = action.payload;
    },
    showFeedBackMessage(state, action) {
      state.showFeedBackUI = true;
    },
    hideFeedBackUI(state, action) {
      state.showFeedBackUI = false;
    },
    setTotalExpenses(state, action) {
      state.expenseTotal = action.payload;
    },
    setBalance(state, action) {
      state.salaryBalance = action.payload;
    },
    getSelectedTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },
    setSpendingPercentage(state, action) {
      state.spendingPercentage = action.payload;
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
  getSalary,
  showFeedBackMessage,
  hideFeedBackUI,
  setTotalExpenses,
  setBalance,
  getSelectedTransaction,
  setSpendingPercentage,
} = expenseSlice.actions;
export default expenseSlice.reducer;
