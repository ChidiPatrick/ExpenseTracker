import React, { useRef, useState } from "react";
import styles from "./editExpense.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  GetExpenseObj,
  setTransactionToEdit,
  getExpenseObj,
  getAllMonthsExpenseArray,
  hideEditUI,
} from "../expenseDetails/expenseSlice";
import { setCategoryFromEditUI } from "../signUpComponent/signUpSlice";
import SmallSpinner from "../smallSpinner/smallSpinner";
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
  const overAllExpenseObj = useSelector((state) => state.expense.expenseObj);
  console.log(overAllExpenseObj);
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
  const tempCurrMonthExpenseObjPosition = useSelector(
    (state) => state.expense.tempCurrMonthExpenseObjPosition
  );
  const isLoading = useSelector((state) => state.expense.getExpenseObjPending);
  console.log(editingTransaction);
  console.log(selectedMonthTransactionIndex);
  console.log(allMonthExpenseArray);
  console.log(currTransactionPosition);

  /////// Local states ////////////////////
  const [showUI, setShowUI] = useState(isLoading);
  //////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////
  ///// Delete Transaction handler /////////////////////
  const deleteTransactionHandler = async (
    allMonthExpenseArray,
    currTransactionPosition,
    tempCurrMonthExpenseObjPosition
  ) => {
    console.log("Delete transaction called");
    setShowUI(true);
    let categoryIndex = null;
    const newAllMonthExpenseArray = [...allMonthExpenseArray];
    const tempCurrExpenseObj =
      newAllMonthExpenseArray[tempCurrMonthExpenseObjPosition];
    console.log(tempCurrExpenseObj);
    const currTransactionArray = tempCurrExpenseObj.transactions;
    const selectedTransaction = currTransactionArray[currTransactionPosition];
    const selectedTransactionCategory = selectedTransaction.category;

    ////// Calculate new expense amount //////////
    const currExpenseArray = [...tempCurrExpenseObj.expenseArray];
    const categoryObj = currExpenseArray.find((obj, index) => {
      if (obj.category === selectedTransactionCategory) {
        categoryIndex = index;
        return obj;
      }
    });
    const newCategoryObj = { ...categoryObj };
    const updatedCategoryTotalAmount =
      parseInt(categoryObj.expenseAmount) -
      parseInt(selectedTransaction.expenseAmount);

    newCategoryObj.expenseAmount = updatedCategoryTotalAmount;
    // const newExpenseArray = [...currExpenseArray];
    currExpenseArray[categoryIndex] = newCategoryObj;
    // const updatedCategoryObj = {
    //   ...categoryObj,
    //   expenseAmount: updatedCategoryTotalAmount,
    // };
    const updatedTransactionArray = currTransactionArray.filter(
      (obj, index) => {
        if (index === currTransactionPosition) return false;
        else {
          return true;
        }
      }
    );
    console.log(updatedTransactionArray);
    const updatedExpenseObj = {
      ...tempCurrExpenseObj,
      expenseArray: currExpenseArray,
      transactions: updatedTransactionArray,
    };
    newAllMonthExpenseArray[tempCurrMonthExpenseObjPosition] =
      updatedExpenseObj;
    console.log(newAllMonthExpenseArray);
    dispatch(getAllMonthsExpenseArray(newAllMonthExpenseArray));
    const data = {
      "expenseObj.monthlyExpenses": [...newAllMonthExpenseArray],
    };
    console.log("Delete transaction execution got here");
    await updateDoc(expenseArrayRef, data).then(() => {
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

    // if (categoryChanged !== true) {
    selectedMonthTransactionArray.map((expense, index) => {
      if (index === currTransactionPosition) {
        console.log(`Found! Current position is: ${index}`);
        oldSelectedTransactionAmount = expense.expenseAmount;
        transactionCategory = expense.category;
        console.log(`Old expense amount: is: ${oldSelectedTransactionAmount}`);
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
    //// Update the overall monthly expense array of objects ///
    const newAllMonthsExpenseArray = [...allMonthExpenseArray];
    console.log("Old all months expense array");
    console.log(newAllMonthsExpenseArray);
    newAllMonthsExpenseArray[index] = {
      ...selectedMonthExpenseObj,
      expenseArray: oldSelectedMonthExpenseArray,
      transactions: transactionArray,
    };
    console.log({
      ...selectedMonthExpenseObj,
      expenseArray: oldSelectedMonthExpenseArray,
      transactions: transactionArray,
    });

    console.log("New all months expense array");
    dispatch(getAllMonthsExpenseArray(newAllMonthsExpenseArray));
    console.log(newAllMonthsExpenseArray);
    const newOverAllExpenseObj = { ...overAllExpenseObj };
    newOverAllExpenseObj.monthlyExpenses = newAllMonthsExpenseArray;
    console.log(newOverAllExpenseObj);
    dispatch(getAllMonthsExpenseArray(newAllMonthsExpenseArray));
    dispatch(getExpenseObj(newOverAllExpenseObj));
    dispatch(hideEditUI());
    navigate(0);

    const data = {
      "expenseObj.monthlyExpenses": [...newAllMonthsExpenseArray],
    };
    await updateDoc(expenseArrayRef, data);
  };

  ////////////////////////////////////////////////////////////////////////////
  const changeCategoryHandler = () => {
    dispatch(setCategoryFromEditUI());
    console.log("transactions");
    navigate("/category");
  };
  //////////////////////////////////////////////////////////////////////////////
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
              // onClick={changeCategoryHandler}
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
        <button
          onClick={() =>
            deleteTransactionHandler(
              allMonthExpenseArray,
              currTransactionPosition,
              tempCurrMonthExpenseObjPosition
            )
          }
          className={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
      <SmallSpinner showUI={isLoading} />
    </div>
  );
};

export default EditExpense;
