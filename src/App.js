import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Spending from "./Components/spendingComponent/spending";
import ExpenseDetails from "./Components/expenseDetails/expenseDetails";
import Category from "./Components/categoryComponent/category";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Spending />} />
        <Route path="/expenseTracker" element={<ExpenseDetails />} />
        <Route path="/expenseTracker/category" element={<Category />} />
      </Routes>
    </div>
  );
}

export default App;
