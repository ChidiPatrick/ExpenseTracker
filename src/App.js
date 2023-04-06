import './App.scss'
import { Routes, Route } from 'react-router-dom'
import Spending from './Components/spendingComponent/spending'
import ExpenseDetails from './Components/expenseDetails/expenseDetails'
function App () {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Spending />} />
        <Route path='/expenseTracker' element={<ExpenseDetails />} />
      </Routes>
    </div>
  )
}

export default App
