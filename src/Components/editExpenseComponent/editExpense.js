import React, { useRef, useState } from "react";
import styles from "./editExpense.module.scss";
import expenseSlice, {
  updateExpenseArray,
} from "../expenseDetails/expenseSlice";
import { Link, useNavigate } from "react-router-dom";
import { hideEditUI } from "../expenseDetails/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  GetExpenseObj,
  setTransactionToEdit,
} from "../expenseDetails/expenseSlice";
import { setCategoryFromEditUI } from "../signUpComponent/signUpSlice";
///////////////////////////////////////////////////////
const EditExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryRef = useRef();
  const amountRef = useRef();
  const noteRef = useRef();

  ////////////////// Selcectors ///////////////////////////
  const displayEditUI = useSelector((state) => state.expense.displayEditUI);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const userId = useSelector((state) => state.signUp.userId);
  const allMonthExpenseArray = useSelector(
    (state) => state.expense.allMonthExpenseArray
  );
  const selectedMonthTransactionIndex = useSelector(
    (state) => state.expense.selectedMonthTransactionIndex
  );
  const transactionToEdit = useSelector(
    (state) => state.expense.transactionToEdit
  );
  const editingTransaction = useSelector(
    (state) => state.expense.editingTransaction
  );
  console.log(editingTransaction);
  console.log(selectedMonthTransactionIndex);
  console.log(transactionToEdit);
  console.log(allMonthExpenseArray);
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
  const changeCategoryHandler = () => {
    dispatch(setCategoryFromEditUI());
    console.log("transactions");
    navigate("/category");
  };
  //////// Change of amount handler //////////////////
  const amountChangeHandler = () => {
    // if (transactionToEdit.expenseAmount !== newAmount) {
    console.log("Value changed!");
    dispatch(
      setTransactionToEdit({
        ...transactionToEdit,
        expenseAmount: amountRef.current.value,
      })
    );

    // }
  };
  const noteChangeHandler = () => {
    console.log(noteRef.current.value);
    dispatch(
      setTransactionToEdit({
        ...transactionToEdit,
        expenseNote: noteRef.current.value,
      })
    );
  };
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
            <div className={styles.currentDate}>{transactionToEdit.date}</div>
            <div
              className={styles.categoryLink}
              // ref={categoryRef}
              onClick={changeCategoryHandler}
            >
              {transactionToEdit.category}
            </div>
            <input
              className={styles.inputElement}
              placeholder=" Enter Amount"
              type="number"
              ref={amountRef}
              onChange={amountChangeHandler}
              defaultValue={transactionToEdit.expenseAmount}
            />
            <div>
              <input
                className={styles.inputElement}
                type="text"
                ref={noteRef}
                placeholder="Enter a note(optional)"
                value={transactionToEdit.expenseNote}
                onChange={noteChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.deleteBtnWrapper}>
        <button className={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  );
};

export default EditExpense;
