import React, { useRef, useState } from "react";
import styles from "./editExpense.module.scss";
import expenseSlice, {
  updateExpenseArray,
} from "../expenseDetails/expenseSlice";
import { Link } from "react-router-dom";
import { hideEditUI } from "../expenseDetails/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { GetExpenseObj } from "../expenseDetails/expenseSlice";

///////////////////////////////////////////////////////
const EditExpense = () => {
  const dispatch = useDispatch();
  const categoryRef = useRef();
  const amountRef = useRef();
  const noteRef = useRef();
  const displayEditUI = useSelector((state) => state.expense.displayEditUI);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const userId = useSelector((state) => state.signUp.userId);
  console.log(categoryRef.current);
  ////Verify the code below later////
  const expenseArray = useSelector((state) => state.expense.expenseArray);
  const selectedTransactionObj = useSelector(
    (state) => state.expense.selectedTransaction
  );
  //////////////////TO LATER//////////////////////////////
  //1. Use selectedTransactionObj to modify edit transaction display
  const handleClose = () => {
    dispatch(hideEditUI());
  };
  const handleExpenseUpdate = async (userId, updatedExpenseArray) => {
    const expenseArrayRef = doc(
      db,
      "users",
      `${userId}`,
      `expenseCollection`,
      `expenses`
    );

    const updateResponds = await updateDoc(expenseArrayRef, {
      expenseArray: updatedExpenseArray,
    });
    updateResponds.then((res) => {
      dispatch(GetExpenseObj(userId));
    });
  };
  const handleDone = (index, expenseArray, userId) => {
    /// Check code functionality later //////
    const newExpenseArray = [...expenseArray];
    const updatedExpenseObj = {
      category: currCategory,
      expenseAmount: amountRef.current.value,
      expenseNote: noteRef.current.value,
    };
    newExpenseArray[index] = updatedExpenseObj;
    handleExpenseUpdate(userId, newExpenseArray);
    dispatch(hideEditUI());
  };
  const handleChange = () => {};
  //Algorithm for editing expense
  //1. Select the expense object by clicking
  //2. Extract the object from the array of expense object
  //3. Assign new value to the extracted object
  //4. Add the updated object to the Array of expense objects
  //5. Update the store and the database
  //6. Fetch the current Array of expense objects
  return (
    <div
      className={
        displayEditUI === true ? styles.expenseDetailsWrapper : styles.hidden
      }
    >
      <div className={styles.navigator}>
        <div onClick={handleClose}>X</div>
        <button className={styles.saveBtn} onClick={handleDone}>
          Done
        </button>
      </div>
      <div className={styles.detailsParentContainer}>
        <div className={styles.expenseDetailsContainer}>
          <div className={styles.detailsLeft}>
            <div className={styles.date}>Date</div>
            <div className={styles.category}>Category</div>
            <div className={styles.amount}>Amount</div>
            <div className={styles.note}>Note</div>
          </div>
          <div className={styles.detailsRight}>
            <div className={styles.currentDate}>date here</div>
            <Link
              to="/category"
              className={styles.categoryLink}
              ref={categoryRef}
            >
              category link
            </Link>
            <input
              className={styles.inputElement}
              placeholder=" Enter Amount"
              type="number"
              ref={amountRef}
              // onChange={handleChange}
              defaultValue={200}
            />
            <div>
              <input
                className={styles.inputElement}
                type="text"
                ref={noteRef}
                placeholder="Enter a note(optional)"
                value="some notes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
