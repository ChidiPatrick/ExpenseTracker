import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "../categoryComponent/categorySlice";
import ExpenseSlice from "../expenseDetails/expenseSlice";
export const Store = configureStore({
  reducer: {
    categories: categorySlice,
    expense: ExpenseSlice,
  },
});
