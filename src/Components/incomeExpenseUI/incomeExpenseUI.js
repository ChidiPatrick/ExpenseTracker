import React, { useEffect } from "react";
import styles from "./incomeExpenseUI.module.scss";
import { Button } from "../buttons/buttons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../spinner/spinner";
import SignupForm from "../signUpComponent/signUp";
import { setTotalExpenses, setBalance } from "../expenseDetails/expenseSlice";
const IncomeExpenseUI = () => {
  const dispatch = useDispatch();
  const currCategory = useSelector((state) => state.expense.expenseArray);
  const expenseTotal = useSelector((state) => state.expense.expenseTotal);
  const expenseArrayObj = useSelector((state) => state.expense.expenseObj);
  const salaryObj = useSelector((state) => state.expense.salary);
  const totalExpense = useSelector((state) => state.expense.expenseTotal);
  const salaryBalance = useSelector((state) => state.expense.salaryBalance);
  const salary = salaryObj.salary;
  const categoriesArray = useSelector(
    (state) => state.categories.categoriesArray
  );
  console.log(totalExpense);
  const expenseArray = expenseArrayObj.expenseArray;
  console.log(expenseArray);

  useEffect(() => {
    let totalExpense = 0;
    if (expenseArray !== undefined) {
      const totalSummation = expenseArray.map((obj) => {
        totalExpense = totalExpense + obj.expenseAmount;
      });
    }
    const newBalance = salary - totalExpense;
    dispatch(setTotalExpenses(totalExpense));
    dispatch(setBalance(newBalance));
  }, [expenseArray]);
  const incomeExpenseUI = (
    <div className={styles.incomeExpenseWrapper}>
      <div className={styles.incomeExpenseInnerWrapper}>
        <div className={styles.incomeWrapper}>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>
            {salary !== undefined ? salary.toFixed(2) : 0}
          </span>
        </div>
        <div className={styles.expenseWrapper}>
          <div className={styles.expenseHeader}>
            <span className={styles.expense}>Expense</span>
            <span className={styles.expenseAmount}>
              {totalExpense.toFixed(2)}
            </span>
          </div>
          {expenseArray !== undefined
            ? expenseArray.map((expenseObj, index) => {
                return (
                  <div className={styles.expenseCategories} key={index}>
                    <span className={styles.expense}>
                      {expenseObj.category}
                    </span>
                    <span className={styles.expenseAmount}>
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
            {salaryBalance.toFixed(2)}
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
  return expenseArray && categoriesArray ? incomeExpenseUI : <Spinner />;
};
export default IncomeExpenseUI;
