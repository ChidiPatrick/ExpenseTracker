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
  allMonthExpenseArray: null,
  currMonthTransactionArray: null,
  displayMoreUI: false,
  currPosition: 0,
  showForwardBtn: false,
  chartArray: [],
  chartColorArray: [],
  user: null,
  showPopUpMessage: false,
  getExpenseObjPending: null,
  transactionToEdit: {},
  selectedMonthTransactionIndex: null,
  editingTransaction: {},
  currTransactionPosition: null,
};

export const GetExpenseObj = createAsyncThunk(
  "expense/getExpenseObj",
  async (userId, { dispatch, getState }) => {
    try {
      const expenseRef = doc(
        db,
        "users",
        `${userId}`,
        `expenseCollection`,
        `expenses`
      );
      const expenseData = await getDoc(expenseRef);
      if (expenseData.exists()) {
        console.log(expenseData.data());
        console.log(expenseData.data().expenseObj);
        dispatch(getExpenseObj(expenseData.data().expenseObj));
        console.log("GET EXPENSE OBJECT REDUCER CALLED!");
        ///////////////// Simplification of data structure /////////////////////////////////
        const currMonthExpenseArrayLength =
          expenseData.data().expenseObj.monthlyExpenses.length;
        const currMonthExpenseObj =
          expenseData.data().expenseObj.monthlyExpenses[
            currMonthExpenseArrayLength - 1
          ];
        ////////////////////////////////////////////////////
        dispatch(getCurrMonthExpenseObj(currMonthExpenseObj));
        dispatch(
          getCurrMonthExpenseArray(
            expenseData.data().expenseObj.monthlyExpenses[
              currMonthExpenseArrayLength - 1
            ].expenseArray
          )
        );
        dispatch(
          getCurrMonthTransactionArray(
            expenseData.data().expenseObj.monthlyExpenses[
              currMonthExpenseArrayLength - 1
            ].transactions
          )
        );
        dispatch(getCurrencySymbol(expenseData.data().currencySymbol));
        dispatch(
          getAllMonthsExpenseArray(
            expenseData.data().expenseObj.monthlyExpenses
          )
        );
        dispatch(
          setUpChartArray(
            expenseData.data().expenseObj.monthlyExpenses[
              currMonthExpenseArrayLength - 1
            ].expenseArray
          )
        );
        dispatch(
          setExpenseChartColorsArray(
            expenseData.data().expenseObj.monthlyExpenses[
              currMonthExpenseArrayLength - 1
            ].expenseArray
          )
        );
        // Check this during refactotring //////
        dispatch(
          getMonthlyArrayLength(
            expenseData.data().expenseObj.monthlyExpenses.length
          )
        );
        dispatch(
          getCurrPosition(expenseData.data().expenseObj.monthlyExpenses.length)
        );
        console.log(
          `Current position is: ${
            expenseData.data().expenseObj.monthlyExpenses.length - 1
          }`
        );
        console.log("Called! Confirm");
      }
    } catch (err) {
      console.log(err);
    }
  }
);
export const GetSalary = createAsyncThunk(
  "salary/getSalary",
  async (userId, { dispatch, getState }) => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  }
);
const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    // getExpenseObj(state, action) {
    //   state.expenseArray = [...state.expenseArray, action.payload];
    // },
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
    getAllMonthsExpenseArray(state, action) {
      state.allMonthExpenseArray = action.payload;
    },
    showMoreUI(state, action) {
      state.displayMoreUI = true;
    },
    hideMoreUI(state, action) {
      state.displayMoreUI = false;
    },
    getCurrPosition(state, action) {
      state.currPosition = action.payload - 1;
    },
    setUpChartArray(state, action) {
      const newChartArray = [];
      const chartArray = action.payload.map((obj, item) => {
        if (obj.expenseAmount > 1)
          newChartArray.push({ name: obj.category, value: obj.expenseAmount });
      });
      state.chartArray = newChartArray;
    },
    setExpenseChartColorsArray(state, action) {
      const newCategoryColorArray = [];
      const colorArray = action.payload.map((obj, index) => {
        newCategoryColorArray.push(obj.categoryColor);
      });
      state.chartColorArray = newCategoryColorArray;
    },
    getUser(state, action) {
      state.user = action.payload;
    },
    showPopUp(state, action) {
      state.showPopUpMessage = true;
    },
    hidePopUp(state, action) {
      state.showPopUpMessage = false;
    },
    getTransactionToEdit(state, action) {
      state.transactionToEdit = action.payload;
    },
    setTransactionToEdit(state, action) {
      state.transactionToEdit = action.payload;
    },
    setSelectedMonthTransactionIndex(state, action) {
      state.selectedMonthTransactionIndex = action.payload;
    },
    setEditingTransaction(state, action) {
      state.editingTransaction = action.payload;
    },
    setCurrTransactionPosition(state, action) {
      state.currTransactionPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(FetchUserData.fulfilled, (state, action) => {
    //     state.fetchedUserData = true;
    //   })
    //   .addCase(fetchUserSettings.fulfilled, (state, action) => {
    //     state.fetchedSettingsData = true;
    //   });
    // builder
    //   .addCase(GetExpenseObj.pending, (state, action) => {
    //     console.log("called");
    //     state.getExpenseObjPending = true;
    //   })
    //   .addCase(GetExpenseObj.fulfilled, (state, action) => {
    //     console.log("called");
    //     state.getExpenseObjPending = false;
    //   });
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
  getAllMonthsExpenseArray,
  showMoreUI,
  hideMoreUI,
  getCurrPosition,
  setUpChartArray,
  setExpenseChartColorsArray,
  getUser,
  showPopUp,
  hidePopUp,
  getTransactionToEdit,
  setSelectedMonthTransactionIndex,
  setEditingTransaction,
  setTransactionToEdit,
  setCurrTransactionPosition,
} = expenseSlice.actions;
export default expenseSlice.reducer;
