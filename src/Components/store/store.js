import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categorySlice from "../categoryComponent/categorySlice";
import ExpenseSlice from "../expenseDetails/expenseSlice";
import signUpSlice from "../signUpComponent/signUpSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
const persistConfig = {
  key: "root",
  storage,
  blackList: ["signUp"],
  stateReconciler: autoMergeLevel1,
};
const rootReducer = combineReducers({
  categories: categorySlice,
  expense: ExpenseSlice,
  signUp: signUpSlice,
});
export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const Store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(Store);
