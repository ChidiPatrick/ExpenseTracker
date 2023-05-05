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
  const expenseTotal = useSelector((state) => state.expense.expenseTotal);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpense = useSelector((state) => state.expense.expenseTotal);
  const salaryBalance = useSelector((state) => state.expense.salaryBalance);
  const currencySymbol = useSelector((state) => state.expense.currencySymbol);
  const categoriesArray = useSelector(
    (state) => state.categories.categoriesArray
  );
  console.log(monthlyExpenseArray);
  // const spendingPercentage = (totalExpense / salary) * 100;
  // console.log(categoriesArray, expenseArray);
  // const balance = salary - totalExpense;
  // useEffect(() => {
  //   let totalExpense = 0;
  //   let spendingPercentage = 0;
  //   if (expenseArray !== undefined) {
  //     const totalSummation = expenseArray.map((obj) => {
  //       totalExpense = totalExpense + obj.expenseAmount;
  //     });
  //     spendingPercentage = (totalExpense / salary) * 100;
  //     dispatch(
  //       setSpendingPercentage(
  //         spendingPercentage === NaN || spendingPercentage === undefined
  //           ? 0
  //           : spendingPercentage
  //       )
  //     );
  //     console.log(spendingPercentage);
  //     const newBalance = salary - totalExpense;
  //     dispatch(setTotalExpenses(totalExpense));
  //     dispatch(setBalance(newBalance));
  //   }
  // }, [expenseArray]);
  const incomeExpenseUI = (
    <div className={styles.incomeExpenseWrapper}>
      <div className={styles.ProgressBarWrapper}>
        <ProgressBar
          barContainerClassName={styles.barContainer}
          // completed={(100 - spendingPercentage).toFixed(2)}
          // completedClassName={styles.completedBar}
          bgColor="rgb(127, 255, 127)"
        />
      </div>
      <div className={styles.incomeExpenseInnerWrapper}>
        <div className={styles.incomeWrapper}>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>
            {currencySymbol}
            {/* {salary !== undefined ? salary.toFixed(2) : 0} */}
          </span>
        </div>
        <div className={styles.expenseWrapper}>
          <div className={styles.expenseHeader}>
            <span className={styles.expense}>Expense</span>
            <span className={styles.expenseAmount}>
              {currencySymbol}
              {/* {totalExpense.toFixed(2)} */}
            </span>
          </div>
          {monthlyExpenseArray !== undefined
            ? monthlyExpenseArray.map((expenseObj, index) => {
                return (
                  <div className={styles.expenseCategories} key={index}>
                    <span className={styles.expense}>
                      {expenseObj.category}
                    </span>
                    <span className={styles.expenseAmount}>
                      {currencySymbol}
                      {/* {expenseObj.expenseAmount.toFixed(2)} */}
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
            {/* {balance.toFixed(2)} */}
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
  // return monthlyExpenseArray && categoriesArray ? incomeExpenseUI : <Spinner />;
  return incomeExpenseUI;
};
export default IncomeExpenseUI;
