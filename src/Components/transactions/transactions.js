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
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Spinner from "../spinner/spinner";
import { auth } from "../Firebase";
import {
  GetSalary,
  getUser,
  GetExpenseObj,
} from "../expenseDetails/expenseSlice";
import {
  getTotalExpenses,
  GetCategories,
} from "../categoryComponent/categorySlice";
import { onAuthStateChanged } from "firebase/auth";
import { getUserId } from "../signUpComponent/signUpSlice";
const Transactions = () => {
  const [showLoader, setShowLoader] = useState(true);
  // window.addEventListener("load", () => {
  //   console.log("RELOADING!");
  //   setTimeout(() => {
  //     console.log("removing loader");
  //     setShowLoader(false);
  //   }, 5000);
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setActiveUser(user);
  //       dispatch(getUser(user));
  //       dispatch(getUserId(user.uid));
  //       dispatch(GetCategories(user.uid));
  //       dispatch(GetExpenseObj(user.uid));
  //       dispatch(GetSalary(user.uid));
  //       dispatch(getTotalExpenses(user.uid));
  //     }
  //   });
  // });
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setActiveUser(user);
  //     dispatch(getUser(user));
  //     dispatch(getUserId(user.uid));
  //     dispatch(GetCategories(user.uid));
  //     dispatch(GetExpenseObj(user.uid));
  //     dispatch(GetSalary(user.uid));
  //     dispatch(getTotalExpenses(user.uid));
  //   }
  // });
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
      <div className={styles.btnWrapper}>
        <button
          className={currPosition === 0 ? styles.hidden : styles.btnMoveBack}
          onClick={() => moveBack(allMonthsExpenseArray, currPosition)}
        >
          <HiChevronLeft className={styles.btnIcon} />
        </button>
        <button
          className={
            currPosition + 1 === currTransactionArrayLength
              ? styles.hidden
              : styles.btnMoveBack
          }
          onClick={() => moveForward(allMonthsExpenseArray, currPosition)}
        >
          <HiChevronRight className={styles.btnIcon} />
        </button>
      </div>

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
        {/* <CurrencySelector /> */}
      </div>
    </>
  );
  return (
    <div className={styles.transactionsWrapper}>
      <NavComponent />
      {displayEditUI !== true ? transactions : <EditExpense />}
    </div>
  );
};
export default Transactions;
