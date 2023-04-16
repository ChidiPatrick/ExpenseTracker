import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "../categoryComponent/categorySlice";
import ExpenseSlice from "../expenseDetails/expenseSlice";
import signUpSlice from "../signUpComponent/signUpSlice";
export const Store = configureStore({
  reducer: {
    categories: categorySlice,
    expense: ExpenseSlice,
    signUp: signUpSlice,
  },
});
