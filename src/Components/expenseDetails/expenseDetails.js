import React, { useRef } from "react";
import styles from "./expenseDetails.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenseObj,
  addExpense,
  updateExpenseArray,
  GetSalary,
} from "./expenseSlice";
import SignUpComponent from "../signUpComponent/signUp";
import { getSelectedCategory } from "../categoryComponent/categorySlice";
import { addDoc, setDoc, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { GetExpenseObj } from "../expenseDetails/expenseSlice";
//////////////////////////////////////////////////////////////////////////
/////Expense Details Component/////////////////////
const ExpenseDetails = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.signUp.userId);
  // const categories = useSelector((state) => state.expense.expenseArray);
  const monthlyExpenseArray = useSelector(
    (state) => state.expense.expenseArray
  );
  // const expenseArray = expensesObj.expenseArray;
  // console.log(expenseArray);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpenses = useSelector((state) => state.expense.totalExpense);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const categoryRef = useRef();
  const amountRef = useRef();
  const noteRef = useRef();
  const date = new Date();
  const testingDate = new Date(expenseObj.date);
  console.log(totalExpenses);
  const expenseArrayRef = doc(
    db,
    "users",
    `${userId}`,
    `expenseCollection`,
    `expenses`
  );
  const totalExpenseRef = doc(
    db,
    "users",
    `${userId}`,
    `salaryCollection`,
    `salaries`
  );
  console.log(monthlyExpenseArray);
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = async (expenseArray) => {
    ////Check for existing category ///////////////
    let updatedSelectedCategoryObj = {};
    let categoryObjIndex = null;
    if (monthlyExpenseArray.length === 0) {
      await updateDoc(expenseArrayRef, {
        "expenseObj.monthlyExpenseArray": [
          {
            date: date.toDateString(),
            expenseArray: [
              {
                category: currCategory,
                expenseAmount: parseInt(amountRef.current.value),
                date: date.toDateString(),
                expenseNote: noteRef.current.value,
              },
            ],
            transactions: [
              {
                category: currCategory,
                expenseAmount: parseInt(amountRef.current.value),
                date: date.toDateString(),
                expenseNote: noteRef.current.value,
              },
            ],
          },
        ],
      });
      console.log("Function called");
      await updateDoc(totalExpenseRef, {
        totalExpense:
          parseInt(totalExpenses) + parseInt(amountRef.current.value),
      });
      dispatch(GetExpenseObj());
      amountRef.current.value = "";
      noteRef.current.value = "";
      return;
    } else if (monthlyExpenseArray.length > 0) {
      const selectedCategoryObj = monthlyExpenseArray.find(
        (categoryObj, index) => {
          if (categoryObj.category === currCategory) {
            categoryObjIndex = index;
            return categoryObj;
          } else {
            return undefined;
          }
        }
      );
      if (selectedCategoryObj === undefined) {
        const oldExpenseArray = monthlyExpenseArray;
        await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenseArray": [
            ...oldExpenseArray,
            {
              category: currCategory,
              expenseAmount: parseInt(amountRef.current.value),
              date: date.toDateString(),
              expenseNote: noteRef.current.value,
            },
          ],
        });
        await updateDoc(totalExpenseRef, {
          totalExpenses:
            parseInt(totalExpenses) + parseInt(amountRef.current.value),
        });
        dispatch(GetExpenseObj());
        dispatch(GetSalary(userId));
        amountRef.current.value = "";
        noteRef.current.value = "";
      } else if (selectedCategoryObj.category === currCategory) {
        const oldExpenseArray = [...monthlyExpenseArray];
        const newExpenseAmount =
          selectedCategoryObj.expenseAmount + parseInt(amountRef.current.value);
        updatedSelectedCategoryObj = {
          ...selectedCategoryObj,
          expenseAmount: newExpenseAmount,
        };
        oldExpenseArray[categoryObjIndex] = updatedSelectedCategoryObj;
        await updateDoc(totalExpenseRef, {
          totalExpenses:
            parseInt(totalExpenses) + parseInt(amountRef.current.value),
        });
        const response = await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenseArray": [...oldExpenseArray],
        });
        dispatch(updateExpenseArray(oldExpenseArray));
        dispatch(addExpense(amountRef.current.value));
        dispatch(GetSalary(userId));
        dispatch(getSelectedCategory(""));

        response.then((res) => {
          dispatch(GetExpenseObj());
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
          onClick={() => saveExpense(monthlyExpenseArray)}
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
              replace
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
