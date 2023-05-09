import React, { useEffect } from "react";
import styles from "./incomeExpenseUI.module.scss";
import { Button } from "../buttons/buttons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../spinner/spinner";
import SignupForm from "../signUpComponent/signUp";
import { setTotalExpenses, setBalance } from "../expenseDetails/expenseSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import { setSpendingPercentage } from "../expenseDetails/expenseSlice";
const IncomeExpenseUI = () => {
  const dispatch = useDispatch();
  const monthlyExpenseArray = useSelector(
    (state) => state.expense.expenseArray
  );
  const currMonthExpenseArray = useSelector(
    (state) => state.expense.expenseArray
  );
  const currMonthExpenseObj = useSelector(
    (state) => state.expense.currMonthExpenseObj
  );
  console.log(currMonthExpenseArray);
  // const expenseArrayLength = useSelector(
  //   (state) => state.expense.expenseArrayLength
  // );
  // const arrayLength = monthlyExpenseArray.length;
  // const currMonthExpenseObj = monthlyExpenseArray[[expenseArrayLength - 1]];
  // let currMonthExpenseArray;
  // useEffect(() => {
  //   if (currMonthExpenseObj.expenseArray === undefined) return;
  //   else {
  //     currMonthExpenseArray = currMonthExpenseObj.expenseArray;
  //     console.log(currMonthExpenseArray);
  //   }
  // }, [currMonthExpenseObj]);
  // const currMonthExpenseArray = currMonthExpenseObj.expenseArray;
  // console.log(currMonthExpenseArray);
  // const expenseTotal = useSelector((state) => state.expense.expenseTotal);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpense = useSelector((state) => state.categories.totalExpense);
  const salaryBalance = useSelector((state) => state.expense.salaryBalance);
  const currencySymbol = useSelector((state) => state.expense.currencySymbol);
  const categoriesArray = useSelector(
    (state) => state.categories.categoriesArray
  );
  // console.log(monthlyExpenseArray.length);
  // let arrayLength;
  // useEffect(() => {
  //   if (monthlyExpenseArray === undefined || monthlyExpenseArray.length === 0)
  //     return;
  //   // arrayLength = monthlyExpenseArray.lengt;
  //   console.log("I was just called sir");
  // }, [monthlyExpenseArray]);
  // console.log(arrayLength);
  const spendingPercentage = (totalExpense / salary) * 100;
  console.log(spendingPercentage);
  const balance = salary - totalExpense;
  const incomeExpenseUI = (
    <div className={styles.incomeExpenseWrapper}>
      <div className={styles.ProgressBarWrapper}>
        <ProgressBar
          barContainerClassName={styles.barContainer}
          completed={(100 - spendingPercentage).toFixed(2)}
          completedClassName={styles.completedBar}
          bgColor="rgb(127, 255, 127)"
        />
      </div>
      <div className={styles.incomeExpenseInnerWrapper}>
        <div className={styles.incomeWrapper}>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>
            {currencySymbol}
            {salary !== undefined ? salary.toFixed(2) : 0}
          </span>
        </div>
        <div className={styles.expenseWrapper}>
          <div className={styles.expenseHeader}>
            <span className={styles.expense}>Expense</span>
            <span className={styles.expenseAmount}>
              {currencySymbol}
              {totalExpense.toFixed(2)}
            </span>
          </div>
          {currMonthExpenseArray !== undefined
            ? currMonthExpenseArray.map((expenseObj, index) => {
                return (
                  <div className={styles.expenseCategories} key={index}>
                    <span className={styles.expense}>
                      {expenseObj.category}
                    </span>
                    <span className={styles.expenseAmount}>
                      {currencySymbol}
                      {expenseObj.expenseAmount.toFixed(2)}
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        <div className={styles.dottedLine}></div>
        <div className={styles.balanceWrapper}>
          <span className={styles.balance}>Balance</span>
          <span className={styles.balanceAmount}>
            {currencySymbol}
            {balance.toFixed(2)}
          </span>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Link className={styles.btnTransparent} to="/expenseTracker" replace>
          <span className={styles.add}>+</span>
          <span>Expense</span>
        </Link>
        <Link
          className={styles.btnTransparent}
          to="/transactionDetails"
          replace
        >
          <span className={styles.add}>+</span>
          <span>Income</span>
        </Link>
      </div>
      <SignupForm />
    </div>
  );
  return expenseObj && categoriesArray ? incomeExpenseUI : <Spinner />;
  // return incomeExpenseUI;
};
export default IncomeExpenseUI;
