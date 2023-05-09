import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
const initialState = {
  expenseArray: undefined,
  expenseObj: {},
  displayEditUI: false,
  salary: 0,
  salaryBalance: 0,
  showFeedBackUI: false,
  selectedTransaction: {},
  spendingPercentage: 0,
  currencySymbol: "",
  currMonthExpenseObj: null,
  monthlyExpenseArrayLength: 0,
  currMonthTransactionArray: null,
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
    const monthlyExpenseArray = await getDoc(expenseRef);
    if (monthlyExpenseArray.exists()) {
      console.log(monthlyExpenseArray.data());
      console.log(monthlyExpenseArray.data().expenseObj);
      dispatch(getExpenseObj(monthlyExpenseArray.data().expenseObj));
      const currMonthExpenseArrayLength =
        monthlyExpenseArray.data().expenseObj.monthlyExpenses.length;
      dispatch(
        getCurrMonthExpenseArray(
          monthlyExpenseArray.data().expenseObj.monthlyExpenses[
            currMonthExpenseArrayLength - 1
          ].expenseArray
        )
      );
      const currMonthTransactions =
        monthlyExpenseArray.data().expenseObj.monthlyExpenses[
          currMonthExpenseArrayLength - 1
        ].transactions;
      console.log(currMonthTransactions);
      dispatch(
        getCurrMonthTransactionArray(
          monthlyExpenseArray.data().expenseObj.monthlyExpenses[
            currMonthExpenseArrayLength - 1
          ].transactions
        )
      );
      dispatch(getCurrencySymbol(monthlyExpenseArray.data().currencySymbol));
      // Check this during refactotring //////
      dispatch(
        getMonthlyArrayLength(
          monthlyExpenseArray.data().expenseObj.monthlyExpenses.length
        )
      );
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
        parseInt(state.totalExpense) + parseInt(action.payload)
      ).toFixed(2);
    },
    updateExpenseArray(state, action) {
      state.expenseArray = action.payload;
    },
    getCurrMonthExpenseArray(state, action) {
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
      state.totalExpense = action.payload;
    },
    getCurrencySymbol(state, action) {
      state.currencySymbol = action.payload;
    },
    getExpenseObj(state, action) {
      state.expenseObj = action.payload;
    },
    getCurrMonthExpenseObj(state, action) {
      state.currMonthExpenseObj = action.payload;
    },
    getMonthlyArrayLength(state, action) {
      state.monthlyExpenseArrayLength = action.payload;
    },
    getCurrMonthTransactionArray(state, action) {
      state.currMonthTransactionArray = action.payload;
    },
  },
});
export const {
  getExpenseObj,
  addExpense,
  updateExpenseArray,
  getCurrMonthExpenseArray,
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
  getCurrMonthExpenseObj,
  getMonthlyArrayLength,
  getCurrMonthTransactionArray,
} = expenseSlice.actions;
export default expenseSlice.reducer;
