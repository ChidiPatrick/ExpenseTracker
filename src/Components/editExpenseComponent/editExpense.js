import React, { useRef, useState } from "react";
import styles from "./editExpense.module.scss";
import expenseSlice, {
  updateExpenseArray,
  getAllMonthsExpenseArray,
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
  const currTransactionPosition = useSelector(
    (state) => state.expense.currTransactionPosition
  );
  const categoryChanged = useSelector((state) => state.signUp.categoryChanged);
  console.log(editingTransaction);
  console.log(selectedMonthTransactionIndex);
  console.log(allMonthExpenseArray);
  console.log(currTransactionPosition);

  //// Firebase expense array reference ///////////
  const expenseArrayRef = doc(
    db,
    "users",
    `${userId}`,
    `expenseCollection`,
    `expenses`
  );

  ////Verify the code below later////
  const expenseArray = useSelector((state) => state.expense.expenseArray);
  const selectedTransactionObj = useSelector(
    (state) => state.expense.selectedTransaction
  );
  console.log(categoryChanged);
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
  ///////////// HandleDone Function ///////////////////
  const handleDone = async (
    index,
    allMonthExpenseArray,
    userId,
    currTransactionPosition
  ) => {
    console.log(index);

    ////////// Simplify Imported Data /////////
    const selectedMonthExpenseObj = allMonthExpenseArray[index];
    const selectedMonthExpenseArray = allMonthExpenseArray[index].expenseArray;
    const selectedMonthTransactionArray =
      allMonthExpenseArray[index].transactions;
    const transactionArray = [...selectedMonthTransactionArray];
    console.log(transactionArray);

    ////////// Important variable declarations ///////////
    let oldSelectedTransactionAmount = 0;
    let newExpense = {};
    let transactionCategory = "";
    let expenseObjIndex = 0;
    let updatedSelectedMonthExpenseObj = {};

    if (categoryChanged !== true) {
      selectedMonthTransactionArray.map((expense, index) => {
        if (index === currTransactionPosition) {
          console.log(`Found! Current position is: ${index}`);
          oldSelectedTransactionAmount = expense.expenseAmount;
          transactionCategory = expense.category;
          console.log(
            `Old expense amount: is: ${oldSelectedTransactionAmount}`
          );
          console.log(`transaction category is: ${transactionCategory}`);
          let currExpense = expense;
          newExpense = {
            ...currExpense,
            expenseAmount: parseInt(amountRef.current.value),
            expenseNote: noteRef.current.value,
          };
          transactionArray[index] = newExpense;
        }
      });

      const expenseObj = selectedMonthExpenseArray.find((expensObj, index) => {
        if (expensObj.category === transactionCategory) {
          expenseObjIndex = index;
          return expensObj;
        }
      });
      console.log(expenseObj);

      /// Calculation of new category expense total //////
      let oldCategoryTotalExpenseAmount = expenseObj.expenseAmount;
      const totalCategoryExpenseAmountAfterDeduction =
        oldCategoryTotalExpenseAmount - oldSelectedTransactionAmount;
      const updatedTotalCategoryExpenseAmount =
        parseInt(totalCategoryExpenseAmountAfterDeduction) +
        parseInt(newExpense.expenseAmount);
      console.log(
        `Updated total category expense: ${updatedTotalCategoryExpenseAmount}`
      );
      const updatedExpenseObj = {
        ...expenseObj,
        expenseAmount: parseInt(updatedTotalCategoryExpenseAmount),
      };
      console.log(updatedExpenseObj);

      //Created new array for different types of expense category object////
      const oldSelectedMonthExpenseArray = [...selectedMonthExpenseArray];
      console.log("Old expense array");
      console.log(oldSelectedMonthExpenseArray);
      oldSelectedMonthExpenseArray[expenseObjIndex] = updatedExpenseObj;
      console.log(oldSelectedMonthExpenseArray);
      //////////////////////////////////////////////////////////////////////////////////////
      //Update the overall monthly expense array of objects ///
      const newAllMonthsExpenseArray = [...allMonthExpenseArray];
      console.log("Old all months expense array");
      console.log(newAllMonthsExpenseArray);
      newAllMonthsExpenseArray[index] = {
        ...selectedMonthExpenseObj,
        // expenseAmount: parseInt(updatedTotalCategoryExpenseAmount),
        expenseArray: oldSelectedMonthExpenseArray,
        transactions: transactionArray,
      };
      console.log("New object");
      console.log({
        ...selectedMonthExpenseObj,
        expenseArray: oldSelectedMonthExpenseArray,
        transactions: transactionArray,
      });
      console.log("New all months expense array");
      dispatch(getAllMonthsExpenseArray(newAllMonthsExpenseArray));
      console.log(newAllMonthsExpenseArray);

      await updateDoc(expenseArrayRef, {
        " expenseObj.monthlyExpenses": newAllMonthsExpenseArray,
      }).then(() => {
        console.log("Got here!");
      });
      dispatch(GetExpenseObj(userId));
    }
    // /// Check code functionality later //////
    // const newExpenseArray = [...expenseArray];
    // const updatedExpenseObj = {
    //   category: currCategory,
    //   expenseAmount: amountRef.current.value,
    //   expenseNote: noteRef.current.value,
    // };
    // newExpenseArray[index] = updatedExpenseObj;
    // handleExpenseUpdate(userId, newExpenseArray);
    // dispatch(hideEditUI());
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
        <button
          className={styles.saveBtn}
          onClick={() =>
            handleDone(
              selectedMonthTransactionIndex,
              allMonthExpenseArray,
              userId,
              currTransactionPosition
            )
          }
        >
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
