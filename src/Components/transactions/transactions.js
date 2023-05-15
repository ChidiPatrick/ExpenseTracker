import React, { useEffect, useState } from "react";
import styles from "./transactions.module.scss";
import NavComponent from "../navigationComponent/navComponent";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import EditExpense from "../editExpenseComponent/editExpense";
import {
  showEditUI,
  getSelectedTransaction,
  moveBackToPreviousMonth,
  moveToMonthsInFront,
} from "../expenseDetails/expenseSlice";
import {
  activateOnTransactionUI,
  deactivateOnTransactionUI,
} from "../categoryComponent/categorySlice";
import CurrencySelector from "../currencySelector/currencySelector";
import ExpenseChart from "../expenseChart/expenseChart";
const Transactions = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const currencySymbol = useSelector((state) => state.expense.currencySymbol);
  const expenseArray = useSelector((state) => state.expense.expenseObj);
  const displayEditUI = useSelector((state) => state.expense.displayEditUI);
  const totalExpense = useSelector((state) => state.categories.totalExpense);
  const mainCurrPosition = useSelector((state) => state.expense.currPosition);
  const salary = useSelector((state) => state.expense.salary);
  const expenseObj = useSelector((state) => state.expense.expenseObj);

  let allMonthsExpenseArray = expenseObj.monthlyExpenses;
  const allMonthExpenseArrayLength = allMonthsExpenseArray.length;
  console.log(allMonthsExpenseArray);
  let currMonthTransactionArray = useSelector(
    (state) => state.expense.currMonthTransactionArray
  );
  let [currPosition, setCurrPosition] = useState(mainCurrPosition);

  console.log(currMonthTransactionArray);
  console.log(`Current position is: ${currPosition}`);
  useEffect(() => {
    dispatch(activateOnTransactionUI());
    return () => {
      dispatch(deactivateOnTransactionUI());
    };
  }, []);
  //////// Handlers ///////////////////
  const showEditUIHandler = () => {
    dispatch(showEditUI());
  };
  const dummyMonthlyExpenseObjArray = [
    {
      date: "Fri Jan 19 2023",
      expenseTransactionsArray: [
        {
          date: "Fri Jan 19 2023",
          expenseAmount: 100,
          category: "Travel",
          time: "7:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Fri Jan 19 2023",
          expenseAmount: 100,
          category: "Travel",
          time: "9:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Fri Jan 19 2023",
          expenseAmount: 100,
          category: "Travel",
          time: "11:15:35 PM",
          expenseNote: "",
        },
      ],
    },
    {
      date: "Fri Feb 19 2023",
      expenseTransactionsArray: [
        {
          date: "Fri Feb 19 2023",
          expenseAmount: 100,
          category: "Food Stuffs",
          time: "7:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Fri Feb 10 2023",
          expenseAmount: 100,
          category: "Food Stuffs",
          time: "9:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Fri Feb 18 2023",
          expenseAmount: 100,
          category: "Food Stuffs",
          time: "11:15:35 PM",
          expenseNote: "",
        },
      ],
    },
    {
      date: "Fri Mar 19 2023",
      expenseTransactionsArray: [
        {
          date: "Sun Mar 20 2023",
          expenseAmount: 100,
          category: "Game",
          time: "7:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Mon Mar 26 2023",
          expenseAmount: 100,
          category: "Game",
          time: "9:15:35 PM",
          expenseNote: "",
        },
        {
          date: "Sat Mar 30 2023",
          expenseAmount: 100,
          category: "Game",
          time: "11:15:35 PM",
          expenseNote: "",
        },
      ],
    },
  ];
  let [currTransactionArray, setDummyTransactionArray] = useState(
    // dummyMonthlyExpenseObjArray[2].expenseTransactionsArray
    allMonthsExpenseArray[allMonthExpenseArrayLength - 1].transactions
  );
  const currTransactionArrayLength = currTransactionArray.length;
  //// Show Previous months transactions handler ///////
  const moveBack = (allMonthsObjArray, currPosition) => {
    console.log(`Dummy expenseArray length: ${currPosition}`);
    if (currPosition > 0) {
      let newCurrPosition = currPosition - 1;
      const currObj = allMonthsObjArray[newCurrPosition];
      const currTransactions = currObj.transactions;
      let currTransactionArray = currTransactions;
      setDummyTransactionArray(currTransactionArray);
      setCurrPosition(newCurrPosition);
      return;
    } else if (currPosition === 0) {
      return;
    }
  };
  //// Dis play transactions in fron //////////////////
  const moveForward = (allMonthExpenseArray, currPosition) => {
    if (currPosition > 0 && currPosition + 1 < currTransactionArrayLength) {
      let newCurrPosition = currPosition + 1;
      const currObj = allMonthExpenseArray[newCurrPosition];
      const currTransactions = currObj.transactions;
      let currTransactionArray = currTransactions;
      setDummyTransactionArray(currTransactionArray);
      setCurrPosition(newCurrPosition);
      return;
    }
  };
  /////////////////////////////////////////////////////
  const transactions = (
    <>
      <button
        className={currPosition === 0 ? styles.hidden : styles.btnMoveBack}
        onClick={() => moveBack(allMonthsExpenseArray, currPosition)}
      >
        Move Back
      </button>
      <button
        className={
          currPosition + 1 === currTransactionArrayLength
            ? styles.hidden
            : styles.btnMoveBack
        }
        onClick={() => moveForward(allMonthsExpenseArray, currPosition)}
      >
        Forward
      </button>
      <div className={styles.salaryAndExpense}>
        <div className={styles.salary}>
          {currencySymbol}
          {salary}
        </div>
        <div className={styles.expenseTotal}>
          {currencySymbol}
          {totalExpense}
        </div>
      </div>
      <div
        className={styles.transactionsContaiiner}
        onClick={showEditUIHandler}
      >
        <div className={styles.transactionHistory}>
          <div className={styles.categoryLeft}>
            <div>Icon</div>
            <div className={styles.expenseDetails}>
              <div className={styles.expenseCategory}>Expense Category</div>
              <div className={styles.date}>Mon,17 Apr 2023</div>
            </div>
          </div>
          <div className={styles.expenseAmount}>£102.00</div>
        </div>
        <div>
          {currTransactionArray.map((expense, index) => {
            return (
              <div
                className={styles.transactionHistory}
                key={index}
                onClick={() => showEditUIHandler(index, expenseArray)}
              >
                <div className={styles.categoryLeft}>
                  <div className={styles.expenseDetails}>
                    {expense.expenseNote === "" ? (
                      <div className={styles.expenseCategory}>
                        {expense.category}
                      </div>
                    ) : (
                      <div className={styles.expenseCategory}>
                        {expense.expenseNote}
                      </div>
                    )}
                    <div className={styles.dateAndTimeWrapper}>
                      <div className={styles.date}>{expense.date}</div>
                      <div className={styles.time}>{expense.time}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.expenseAmount}>
                  {currencySymbol}
                  {expense.expenseAmount}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.transactionHistory}>
          <div className={styles.categoryLeft}>
            <div>Icon</div>
            <div className={styles.expenseDetails}>
              <div className={styles.expenseCategory}>Salary</div>
              <div className={styles.date}>Mon,17 Apr 2023</div>
            </div>
          </div>
          <div className={styles.expenseAmount}>£120,200.00</div>
        </div>
        {/* <CurrencySelector /> */}
      </div>
    </>
  );
  return (
    <div className={styles.transactionsWrapper}>
      <ExpenseChart />
      <NavComponent />
      {displayEditUI !== true ? transactions : <EditExpense />}
    </div>
  );
};
export default Transactions;
