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
  getExpenseObj,
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

      const newOverAllExpenseObj = { ...overAllExpenseObj };
      newOverAllExpenseObj.monthlyExpenses = newAllMonthsExpenseArray;
      console.log(newOverAllExpenseObj);
      dispatch(getExpenseObj(newOverAllExpenseObj));
      const data = {
        "expenseObj.monthlyExpenses": [...newAllMonthsExpenseArray],
      };
      // await updateDoc(expenseArrayRef, data).then(() => {
      //   console.log("Got here!");
      // });

      // dispatch(GetExpenseObj(userId));
    }
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

const monthExpneseArrayStructure = {
  dateCreated: "Mon May 22 2023",
  expenseArray: [],
  transactions: [],
};
const mayExpenseArray = [
  {
    category: "General",
    expenseAmount: 0,
    time: "12:18:49 PM",
    expenseNote: "General Expense",
    date: "Mon May 22 2023",
  },
  {
    date: "Mon May 22 2023",
    expenseAmount: 450,
    categoryColor: "#ff9800",
    expenseNote: "Bought oka",
    time: "13:11:58",
  },
  {
    category: "Food stuff",
    expenseNote: "",
    date: "Tue May 23 2023",
    time: "4:26:07 PM",
    expenseAmount: 2000,
  },
  {
    expenseNote: "",
    date: "Sun May 28 2023",
    time: "8:43:05 AM",
    category: "Rent",
    expenseAmount: 2000,
  },
  {
    date: "Sun May 28 2023",
    categoryColor: "#9c27b0",
    expenseAmount: 200,
    time: "9:50:37 AM",
    expenseNote: "",
  },
  {
    categoryColor: "#03a9f4",
    expenseNote: "",
    time: "9:55:39 AM",
    category: "Stationaries",
    expenseAmount: 500,
  },
];

const mayTransactionArray = [
  {
    time: "12:18:49 PM",
    expenseNote: "General Expense",
    date: "Mon May 22 2023",
    expenseAmount: 0,
    category: "General",
  },
  {
    expenseAmount: 450,
    expenseNote: "Bought two shirts",
    date: "Mon May 22 2023",
    category: "Travel",
    time: "13:11:58",
  },
  {
    time: "4:26:07 PM",
    date: "Tue May 23 2023",
    expenseNote: "",
    expenseAmount: 2000,
    category: "Food stuff",
  },
  {
    time: "8:43:05 AM",
    expenseNote: "",
    date: "Sun May 28 2023",
    expenseAmount: 2000,
    category: "Rent",
  },
  {
    category: "Clothing",
    expenseNote: "",
    time: "9:50:37 AM",
    expenseAmount: 200,
    date: "Sun May 28 2023",
  },
  {
    date: "Sun May 28 2023",
    expenseNote: "",
    time: "9:55:39 AM",
    category: "Stationaries",
    expenseAmount: 500,
  },
];

const JunExpenseArray = [
  {
    expenseNote: "",
    time: "3:34:07 PM",
    expenseAmount: 200,
    category: "Rent",
    categoryColor: "#ffeb3b",
  },
  {
    expenseNote: "Bought two shirts",
    date: "Wed Jun 14 2023",
    time: "8:14:40 AM",
    expenseAmount: 201,
    categoryColor: "#9c27b0",
  },
];

const juneTransactionArray = [
  {
    expenseAmount: 200,
    category: "Rent",
    time: "3:34:07 PM",
    date: "Sun Jun 04 2023",
    expenseNote: "",
  },

  {
    date: "Wed Jun 14 2023",
    expenseAmount: 151,
    expenseNote: "Bought two shirts",
    category: "Clothing",
    time: "8:14:40 AM",
  },

  {
    expenseNote: "Singlet",
    date: "Wed Jun 14 2023",
    category: "Clothing",
    time: "8:15:23 AM",
    expenseAmount: 50,
  },
];
