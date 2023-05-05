import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
const initialState = {
  expenseArray: undefined,
  expenseObj: {},
  totalExpense: 0,
  displayEditUI: false,
  salary: 0,
  salaryBalance: 0,
  showFeedBackUI: false,
  selectedTransaction: {},
  spendingPercentage: 0,
  currencySymbol: "",
};

export const GetExpenseObj = createAsyncThunk(
  "expense/getExpenseObj",
  async (userId, { dispatch, getState }) => {
    const expenseRef = doc(
      db,
      "users",
      `${userId}`,
      `expenseCollection`,
      `expenses`
    );
    const expensesObj = await getDoc(expenseRef);
    if (expensesObj.exists()) {
      console.log(expensesObj.data());
      console.log(expensesObj.data().expenseObj);
      dispatch(getExpenseObj(expensesObj.data().expenseObj));
      dispatch(
        getExpenseArray(expensesObj.data().expenseObj.monthlyExpenseArray)
      );
      dispatch(getCurrencySymbol(expensesObj.data().currencySymbol));
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
      console.log(salary.data().salary);
      dispatch(getSalary(salary.data().salary));
      dispatch(getTotalExpenses(salary.data().totalExpenses));
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
    getExpenseArray(state, action) {
      state.expenseArray = action.payload;
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
    getTotalExpenses(state, action) {
      state.expenseTotal = action.payload;
    },
    getCurrencySymbol(state, action) {
      state.currencySymbol = action.payload;
    },
    getExpenseObj(state, action) {
      state.expenseObj = action.payload;
    },
  },
});
export const {
  getExpenseObj,
  addExpense,
  updateExpenseArray,
  getExpenseArray,
  hideEditUI,
  showEditUI,
  getSalary,
  showFeedBackMessage,
  hideFeedBackUI,
  setTotalExpenses,
  setBalance,
  getSelectedTransaction,
  setSpendingPercentage,
  getTotalExpenses,
  getCurrencySymbol,
} = expenseSlice.actions;
export default expenseSlice.reducer;
