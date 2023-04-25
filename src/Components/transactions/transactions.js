import React from "react";
import styles from "./transactions.module.scss";
import NavComponent from "../navigationComponent/navComponent";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import EditExpense from "../editExpenseComponent/editExpense";
import { showEditUI } from "../expenseDetails/expenseSlice";
const Transactions = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const expenseArray = useSelector((state) => state.expense.expenseArray);
  console.log(expenseArray);
  console.log(params);
  const showEditUIHandler = () => {
    console.log("Clicked");
    dispatch(showEditUI());
  };
  return (
    <div className={styles.transactionsWrapper}>
      <NavComponent />
      <div className={styles.salaryAndExpense}>
        <div className={styles.salary}>£150,000.00</div>
        <div className={styles.expenseTotal}>£690.00</div>
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
          {expenseArray.map((expense, index) => {
            return (
              <div
                className={styles.transactionHistory}
                onClick={showEditUIHandler}
              >
                <div className={styles.categoryLeft}>
                  <div>Icon</div>
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
                    <div className={styles.date}>{expense.date}</div>
                  </div>
                </div>
                <div className={styles.expenseAmount}>
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
      </div>
      <EditExpense />
    </div>
  );
};
export default Transactions;
