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
import { object } from "yup";
//////////////////////////////////////////////////////////////////////////
/////Expense Details Component/////////////////////
const ExpenseDetails = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.signUp.userId);
  // const categories = useSelector((state) => state.expense.expenseArray);
  const allExpenseArray = useSelector((state) => state.expense.expenseArray);
  const monthlyExpenseArray = [...allExpenseArray];
  console.log(monthlyExpenseArray);
  const arrayLength = monthlyExpenseArray.length;
  const objIndex = arrayLength - 1;
  const currMonthObj = monthlyExpenseArray[objIndex];
  const currMonthObjExpenseArray = currMonthObj.expenseArray;
  console.log(monthlyExpenseArray[arrayLength - 1]);
  console.log(currMonthObj.expenseArray);
  console.log(currMonthObjExpenseArray);
  console.log(`Currnet month`);
  console.log(currMonthObj);
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
  const firstExpenseObjMonth = new Date(expenseObj.date).getMonth();
  console.log(firstExpenseObjMonth);
  // const expenseObjArray = Object.values(expenseObj.expenses);
  console.log(expenseObj);
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = async (expenseArray) => {
    ////Check for existing category ///////////////
    let updatedSelectedCategoryObj = {};
    let categoryObjIndex = null;
    let selectedCategoryObj = null;
    let currentIndex = null;
    let arrayLength = monthlyExpenseArray.length;
    let objIndex = arrayLength - 1;
    let currMonthObj = monthlyExpenseArray[arrayLength - 1];
    let currMonthObjExpenseArray = currMonthObj.expenseArray;
    const currentMonth = new Date().getMonth();
    // const expenseObjArray = Object.values(expenseObj.expens);

    if (monthlyExpenseArray.length === 0) {
      await updateDoc(expenseArrayRef, {
        "expenseObj.monthlyExpenses": [
          {
            dateCreated: date.toDateString(),
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
    } else if (monthlyExpenseArray.length >= 1) {
      const selectedCategoryObj = currMonthObjExpenseArray.find(
        (expenseObj, index) => {
          if (expenseObj.category === currCategory) {
            categoryObjIndex = index;
            return expenseObj;
          } else {
            return undefined;
          }
        }
      );
      if (selectedCategoryObj === undefined) {
        const oldExpenseArray = currMonthObjExpenseArray;
        const newExpenseArray = [
          ...oldExpenseArray,
          {
            category: currCategory,
            expenseAmount: parseInt(amountRef.current.value),
            date: date.toDateString(),
            expenseNote: noteRef.current.value,
          },
        ];
        //////// Update current month expensArray and monthlyExpenseArray ///////
        currMonthObj = {
          ...currMonthObj,
          expenseArray: newExpenseArray,
          transactions: [
            ...currMonthObj.transactions,
            {
              category: currCategory,
              expenseAmount: parseInt(amountRef.current.value),
              date: date.toDateString(),
              expenseNote: noteRef.current.value,
            },
          ],
        };
        monthlyExpenseArray[objIndex] = currMonthObj;
        await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenses": [...monthlyExpenseArray],
        });
        await updateDoc(totalExpenseRef, {
          totalExpenses:
            parseInt(totalExpenses) + parseInt(amountRef.current.value),
        });
        dispatch(GetExpenseObj());
        dispatch(GetSalary(userId));
        amountRef.current.value = "";
        noteRef.current.value = "";
      }
      //////////////////////////////////////////////////////////////////////
      else if (selectedCategoryObj.category === currCategory) {
        // const oldExpenseArray = [...monthlyExpenseArray];
        console.log("Function for selected category is called");
        const newExpenseAmount =
          selectedCategoryObj.expenseAmount + parseInt(amountRef.current.value);
        console.log("new expense amount:" + newExpenseAmount);
        updatedSelectedCategoryObj = {
          ...selectedCategoryObj,
          expenseAmount: newExpenseAmount,
        };
        const monthObjExpenseArray = [...currMonthObjExpenseArray];
        monthObjExpenseArray[categoryObjIndex] = updatedSelectedCategoryObj;
        currMonthObj = {
          ...currMonthObj,
          expenseArray: [...monthObjExpenseArray],
          transactions: [
            ...currMonthObj.transactions,
            {
              category: currCategory,
              expenseAmount: parseInt(amountRef.current.value),
              date: date.toDateString(),
              expenseNote: noteRef.current.value,
            },
          ],
        };
        monthlyExpenseArray[objIndex] = currMonthObj;
        await updateDoc(totalExpenseRef, {
          totalExpenses:
            parseInt(totalExpenses) + parseInt(amountRef.current.value),
        });

        dispatch(updateExpenseArray(monthlyExpenseArray));
        dispatch(addExpense(amountRef.current.value));
        dispatch(GetSalary(userId));
        dispatch(getSelectedCategory(""));
        await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenses": monthlyExpenseArray,
        });
        dispatch(GetExpenseObj());
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
