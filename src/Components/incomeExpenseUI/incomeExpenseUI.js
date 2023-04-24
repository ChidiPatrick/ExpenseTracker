import React from "react";
import styles from "./incomeExpenseUI.module.scss";
import { Button } from "../buttons/buttons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const IncomeExpenseUI = () => {
  const currCategory = useSelector((state) => state.expense.expenseArray);
  const expenseTotal = useSelector((state) => state.expense.expenseTotal);
  const categoriesArray = useSelector(
    (state) => state.categories.categoriesArray
  );
  console.log(categoriesArray);

  return (
    <div className={styles.incomeExpenseWrapper}>
      <div className={styles.incomeExpenseInnerWrapper}>
        <div className={styles.incomeWrapper}>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>0.00</span>
        </div>
        <div className={styles.expenseWrapper}>
          <div className={styles.expenseHeader}>
            <span className={styles.expense}>Expense</span>
            <span className={styles.expenseAmount}>{expenseTotal}</span>
          </div>
          {currCategory.map((expenseObj, index) => {
            return (
              <div className={styles.expenseCategories} key={index}>
                <span className={styles.expense}>{expenseObj.category}</span>
                <span className={styles.expenseAmount}>
                  {expenseObj.expenseAmount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.dottedLine}></div>
        <div className={styles.balanceWrapper}>
          <span className={styles.balance}>Balance</span>
          <span className={styles.balanceAmount}>{expenseTotal}</span>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Link className={styles.btnTransparent} to="expenseTracker">
          <span className={styles.add}>+</span>
          <span>Expense</span>
        </Link>
        <Link className={styles.btnTransparent} to="transactionDetails">
          <span className={styles.add}>+</span>
          <span>Income</span>
        </Link>
      </div>
    </div>
  );
};
export default IncomeExpenseUI;
