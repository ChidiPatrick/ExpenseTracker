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
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpense = useSelector((state) => state.categories.totalExpense);
  const salaryBalance = useSelector((state) => state.expense.salaryBalance);
  const currencySymbol = useSelector((state) => state.expense.currencySymbol);
  const categoriesArray = useSelector(
    (state) => state.categories.categoriesArray
  );
  console.log(totalExpense);
  const spendingPercentage = (totalExpense / salary) * 100;
  console.log(spendingPercentage);
  const balance = salary - totalExpense;
  const incomeExpenseUI = (
    <div className={styles.incomeExpenseWrapper}>
      <div className={styles.ProgressBarWrapper}>
        <ProgressBar
          completed={100 - spendingPercentage}
          bgColor="#56b96d"
          labelColor="#fff"
          maxCompleted={100}
        />
      </div>
      <div className={styles.incomeExpenseInnerWrapper}>
        <div className={styles.incomeWrapper}>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>
            {currencySymbol}
            {salary.toFixed(2)}
          </span>
        </div>
        <div className={styles.expenseWrapper}>
          <div className={styles.expenseHeader}>
            <span className={styles.expense}>Expenses</span>
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
        <Link className={styles.btnTransparent} to="/addIncome" replace>
          <span className={styles.add}>+</span>
          <span>Income</span>
        </Link>
      </div>
    </div>
  );
  return expenseObj && categoriesArray ? incomeExpenseUI : <Spinner />;
  // return incomeExpenseUI;
};
export default IncomeExpenseUI;
