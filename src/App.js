import "./App.scss";
import { Routes, Route, useNavigate } from "react-router-dom";
import Spending from "./Components/spendingComponent/spending";
import ExpenseDetails from "./Components/expenseDetails/expenseDetails";
import Category from "./Components/categoryComponent/category";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Components/Firebase";
import { getUserId } from "./Components/signUpComponent/signUpSlice";
import { useDispatch } from "react-redux";
import { GetCategories } from "./Components/categoryComponent/categorySlice";
import AddCategory from "./Components/addCategory/addCategory";
import Emojis from "./Components/emojiFolder/emoji";
import ColorPicker from "./Components/colorPicker/colorPicker";
import Transactions from "./Components/transactions/transactions";
import PageNotFound from "./Components/pageNotFound/pageNotFound";
import { GetExpenseObj } from "./Components/expenseDetails/expenseSlice";
import AddIncome from "./Components/addIncome/addIncome";
import { GetSalary } from "./Components/expenseDetails/expenseSlice";
import CurrencySelector from "./Components/currencySelector/currencySelector";
import { getTotalExpenses } from "./Components/categoryComponent/categorySlice";
import ExpenseChart from "./Components/expenseChart/expenseChart";
import LandingPage from "./Components/landingPage/landingPage";
import SignupForm from "./Components/signUpComponent/signUp";
import ResetPassword from "./Components/signUpComponent/forgottenPassword";
function App() {
  const dispatch = useDispatch();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.uid);
      dispatch(getUserId(user.uid));
      dispatch(GetCategories(user.uid));
      dispatch(GetExpenseObj(user.uid));
      dispatch(GetSalary(user.uid));
      dispatch(getTotalExpenses(user.uid));
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ExpenseSummary" element={<Spending />} />
        <Route path="/expenseTracker" element={<ExpenseDetails />} />
        <Route path="/signUpPage" element={<SignupForm />} />
        <Route path="/category" element={<Category />} />
        <Route path="/addCategory" element={<AddCategory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/addIncome" element={<AddIncome />} />
        <Route path="/currencySelectionPage" element={<CurrencySelector />} />
        <Route path="/addIncome" element={<AddIncome />} />
        <Route path="/expenseChart" element={<ExpenseChart />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}
// export const refreshData = (id) => {
//   const dispatch = useDispatch();
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log(user.uid);
//       dispatch(getUserId(user.uid));
//       dispatch(GetCategories(user.uid));
//       dispatch(GetExpenseObj(user.uid));
//       dispatch(GetSalary(user.uid));
//     }
//   });
// };
export default App;
