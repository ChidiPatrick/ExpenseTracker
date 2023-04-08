import React, { useRef } from "react";
import styles from "./expenseDetails.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseObj, addExpense } from "./expenseSlice";
import { getSelectedCategory } from "../categoryComponent/categorySlice";

//////////////////////////////////////////////////////////////////////////
/////Expense Details Component/////////////////////
const ExpenseDetails = () => {
  const dispatch = useDispatch();
  const currCategory = useSelector((state) => state.categories.currCategory);
  const categoryRef = useRef();
  const amountRef = useRef();
  const date = new Date();
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = () => {
    dispatch(
      getExpenseObj({
        category: currCategory,
        expenseAmount: parseInt(amountRef.current.value),
        date: date.toDateString(),
      })
    );
    dispatch(addExpense(amountRef.current.value));
    dispatch(getSelectedCategory(""));
    amountRef.current.value = "";
  };
  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <Link to={-1}>X</Link>
        <button onClick={saveExpense}>Done</button>
      </div>
      <div className={styles.detailsParentContainer}>
        <div className={styles.expenseDetailsContainer}>
          <div className={styles.detailsLeft}>
            <div className={styles.date}>Date</div>
            <div className={styles.category}>Category</div>
            <div className={styles.amount}>Amount</div>
          </div>
          <div className={styles.detailsRight}>
            <div className={styles.currentDate}>{date.toDateString()}</div>
            <Link
              to="category"
              className={styles.categoryLink}
              ref={categoryRef}
            >
              {currCategory === "" ? "Enter category" : currCategory}
            </Link>
            <input
              className={styles.inputElement}
              placeholder=" Enter Amount"
              ref={amountRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpenseDetails;
