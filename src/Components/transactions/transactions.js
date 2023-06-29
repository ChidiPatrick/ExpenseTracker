import React, { useEffect, useState } from "react";
import styles from "./transactions.module.scss";
import NavComponent from "../navigationComponent/navComponent";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import EditExpense from "../editExpenseComponent/editExpense";
import {
  getTransactionToEdit,
  setSelectedMonthTransactionIndex,
  setCurrTransactionPosition,
  setTempCurrExpenseObjPosition,
} from "../expenseDetails/expenseSlice";
import { showEditUI } from "../expenseDetails/expenseSlice";
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
  const params = useParams();
  const dispatch = useDispatch();

  ////////////////// SELECTORS USED /////////////////////////
  const currencySymbol = useSelector((state) => state.expense.currencySymbol);
  const expenseArray = useSelector((state) => state.expense.expenseObj);
  const displayEditUI = useSelector((state) => state.expense.displayEditUI);
  const totalExpense = useSelector((state) => state.categories.totalExpense);
  const mainCurrPosition = useSelector((state) => state.expense.currPosition);
  const salary = useSelector((state) => state.expense.salary);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const allMonthsExpenseArray = useSelector(
    (state) => state.expense.allMonthsExpenseArray
  );
  console.log(allMonthsExpenseArray);
  const allMonthsExpenseArrayLength = allMonthsExpenseArray.length;
  const transactionsArray =
    allMonthsExpenseArray[allMonthsExpenseArrayLength - 1].transactions;
  const transactionToEdit = useSelector(
    (state) => state.expense.transactionToEdit
  );

  /////////////////////////////////////////////////////////////////////
  ///////////////// Local states ///////////////////

  let [currTransactionArray, setDummyTransactionArray] =
    useState(transactionsArray);
  let [currPosition, setCurrPosition] = useState(mainCurrPosition);
  const date = new Date();
  let [transactionMonth, setTransactionMonth] = useState(date.getMonth());

  ///////////////////////////////////////////////////////////////////////
  //////////// useEffects //////////////////////////
  useEffect(() => {
    dispatch(setCurrTransactionPosition(currPosition));
  }, [mainCurrPosition]);

  console.log(allMonthsExpenseArray);
  let currMonthTransactionArray = useSelector(
    (state) => state.expense.currMonthTransactionArray
  );

  console.log(transactionMonth);
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  // const month = new Date().getMonth();
  // console.log(months[mont]);
  console.log(`Current position is: ${currPosition}`);
  useEffect(() => {
    dispatch(activateOnTransactionUI());
    return () => {
      dispatch(deactivateOnTransactionUI());
    };
  }, []);
  //////// Handlers ///////////////////
  const showEditUIHandler = (transaction, index) => {
    console.log("Called");
    dispatch(getTransactionToEdit(transaction));
    dispatch(setCurrTransactionPosition(index));
    console.log("Just one more to move");
    dispatch(showEditUI());
  };

  console.log(currTransactionArray);
  const currTransactionArrayLength = currTransactionArray.length;
  //// Show Previous months transactions handler ///////
  const moveBack = (allMonthsObjArray, currPosition) => {
    console.log(`Dummy expenseArray length: ${currPosition}`);
    if (currPosition > 0) {
      let newCurrPosition = currPosition - 1;
      const currObj = allMonthsObjArray[newCurrPosition];
      const currTransactions = currObj.transactions;
      let currTransactionArray = currTransactions;
      const date = new Date(currObj.dateCreated);
      const currMonth = date.getMonth();
      dispatch(setTempCurrExpenseObjPosition(newCurrPosition));
      setDummyTransactionArray(currTransactionArray);
      setCurrPosition(newCurrPosition);
      dispatch(setSelectedMonthTransactionIndex(newCurrPosition));
      setTransactionMonth(currMonth);
      return;
    } else if (currPosition === 0) {
      return;
    }
  };
  //// Dis play transactions in fron //////////////////
  const moveForward = (allMonthExpenseArray, currPosition) => {
    if (currPosition >= 0) {
      // if (currPosition > 0 && currPosition + 1 <= currTransactionArrayLength) {
      console.log("Test passed");
      let newCurrPosition = currPosition + 1;
      const currObj = allMonthExpenseArray[newCurrPosition];
      console.log(currObj);
      const currTransactions = currObj.transactions;
      let currTransactionArray = currTransactions;
      const date = new Date(currObj.dateCreated);
      const currMonth = date.getMonth();
      dispatch(setTempCurrExpenseObjPosition(newCurrPosition));
      setDummyTransactionArray(currTransactionArray);
      setCurrPosition(newCurrPosition);
      dispatch(setSelectedMonthTransactionIndex(newCurrPosition));
      setTransactionMonth(currMonth);
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
        <div className={styles.currMonth}>{months[transactionMonth]}</div>
        <button
          className={
            currPosition === allMonthsExpenseArrayLength - 1
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
      <div className={styles.transactionsContaiiner}>
        <div>
          {currTransactionArray.map((expense, index) => {
            return (
              <div
                className={styles.transactionHistory}
                key={index}
                onClick={() => showEditUIHandler(expense, index)}
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
