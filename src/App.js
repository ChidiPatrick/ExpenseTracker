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
import { GetExpenseArray } from "./Components/expenseDetails/expenseSlice";
function App() {
  const dispatch = useDispatch();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.uid);
      dispatch(getUserId(user.uid));
      dispatch(GetCategories(user.uid));
      dispatch(GetExpenseArray(user.uid));
    }
  });
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Spending />} />
        <Route path="/expenseTracker" element={<ExpenseDetails />} />
        {/* <Route path="/expenseTracker" element={<Category />} /> */}
        <Route path="/category" element={<Category />} />
        {/* <Route path="/category">
          <Route path="/category/:id" element={<Category />} />
        </Route> */}
        <Route path="/addCategory" element={<AddCategory />} />
        {/* <Route path="/icons" element={<Emojis />} /> */}
        {/* <Route path="/colorPicker" element={<ColorPicker />} /> */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
