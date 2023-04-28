import React, { useRef } from "react";
import styles from "./expenseDetails.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseObj, addExpense, updateExpenseArray } from "./expenseSlice";
import SignUpComponent from "../signUpComponent/signUp";
import { getSelectedCategory } from "../categoryComponent/categorySlice";
import { addDoc, setDoc, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { GetExpenseArray } from "../expenseDetails/expenseSlice";
//////////////////////////////////////////////////////////////////////////
/////Expense Details Component/////////////////////
const ExpenseDetails = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.signUp.userId);
  const categories = useSelector((state) => state.expense.expenseArray);
  const expensesObj = useSelector((state) => state.expense.expenseObj);
  const expenseArray = expensesObj.expenseArray;
  console.log(expenseArray);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const salary = useSelector((state) => state.expense.salary);
  const categoryRef = useRef();
  const amountRef = useRef();
  const noteRef = useRef();
  const date = new Date();
  console.log(salary);
  const expenseArrayRef = doc(
    db,
    "users",
    `${userId}`,
    `expenseCollection`,
    `expenses`
  );
  console.log(currCategory);
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = async (expenseArray) => {
    ////Check for existing category ///////////////
    let updatedSelectedCategoryObj = {};
    let categoryObjIndex = null;
    if (expenseArray.length === 0) {
      await setDoc(expenseArrayRef, {
        expenseArray: [
          {
            category: currCategory,
            expenseAmount: parseInt(amountRef.current.value),
            date: date.toDateString(),
            expenseNote: noteRef.current.value,
          },
        ],
      });
      dispatch(GetExpenseArray());
      amountRef.current.value = "";
      noteRef.current.value = "";
    } else if (expenseArray.length >= 1) {
      const selectedCategoryObj = expenseArray.find((categoryObj, index) => {
        if (categoryObj.category === currCategory) {
          categoryObjIndex = index;
          return categoryObj;
        } else {
          return undefined;
        }
      });
      if (selectedCategoryObj === undefined) {
        const oldExpenseArray = expenseArray;
        await updateDoc(expenseArrayRef, {
          expenseArray: [
            ...oldExpenseArray,
            {
              category: currCategory,
              expenseAmount: parseInt(amountRef.current.value),
              date: date.toDateString(),
              expenseNote: noteRef.current.value,
            },
          ],
        });
        dispatch(GetExpenseArray());
      } else if (selectedCategoryObj.category === currCategory) {
        const oldExpenseArray = [...expenseArray];
        const newExpenseAmount =
          selectedCategoryObj.expenseAmount + parseInt(amountRef.current.value);
        updatedSelectedCategoryObj = {
          ...selectedCategoryObj,
          expenseAmount: newExpenseAmount,
        };
        oldExpenseArray[categoryObjIndex] = updatedSelectedCategoryObj;
        dispatch(updateExpenseArray(oldExpenseArray));
        dispatch(addExpense(amountRef.current.value));
        dispatch(getSelectedCategory(""));
        const response = await updateDoc(expenseArrayRef, {
          expenseArray: [...oldExpenseArray],
        });
        response.then((res) => {
          dispatch(GetExpenseArray());
        });
        amountRef.current.value = "";
      }
    }
  };
  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <Link to={"/"}>X</Link>
        <button
          className={styles.saveBtn}
          onClick={() => saveExpense(expenseArray)}
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
            <div className={styles.currentDate}>{date.toDateString()}</div>
            <Link
              to="/category"
              className={styles.categoryLink}
              ref={categoryRef}
            >
              {currCategory === "" ? "Enter category" : currCategory}
            </Link>
            <input
              className={styles.inputElement}
              placeholder=" Enter Amount"
              type="number"
              ref={amountRef}
            />
            <div>
              <input
                className={styles.inputElement}
                type="text"
                ref={noteRef}
                placeholder="Enter a note(optional)"
              />
            </div>
          </div>
        </div>
      </div>
      <SignUpComponent />
    </div>
  );
};
export default ExpenseDetails;
