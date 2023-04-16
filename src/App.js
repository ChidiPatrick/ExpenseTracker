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
function App() {
  const dispatch = useDispatch();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.uid);
      dispatch(getUserId(user.uid));
      dispatch(GetCategories(user.uid));
    }
  });
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Spending />} />
        <Route path="/expenseTracker" element={<ExpenseDetails />} />
        <Route path="/expenseTracker/category" element={<Category />} />
        <Route path="/category/addCategory" element={<AddCategory />} />
        <Route path="/category/addCategory/icons" element={<Emojis />} />
      </Routes>
    </div>
  );
}

export default App;
