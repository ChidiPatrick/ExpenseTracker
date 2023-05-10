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
  const allMonthExpenseArray = useSelector(
    (state) => state.expense.allMonthExpenseArray
  );
  const allExpenseArray = useSelector((state) => state.expense.expenseArray);
  console.log(allExpenseArray);
  const currMonthExpenseObj = useSelector(
    (state) => state.expense.currMonthExpenseObj
  );
  console.log(currMonthExpenseObj);
  // const monthlyExpenseArray = [...allMonthExpenseArray];
  // console.log(monthlyExpenseArray);
  // const arrayLength = monthlyExpenseArray.length;
  // const objIndex = arrayLength - 1;
  // const currMonthObj = monthlyExpenseArray[objIndex];
  // const monthlyExpenseArray = currMonthObj.expenseArray;
  // console.log(monthlyExpenseArray[arrayLength - 1]);
  // console.log(currMonthObj);
  // console.log(monthlyExpenseArray);
  // console.log(`Currnet month`);
  // console.log(currMonthObj);
  // const expenseArray = expensesObj.expenseArray;
  // console.log(expenseArray);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpenses = useSelector((state) => state.categories.totalExpense);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const categoryRef = useRef();
  const amountRef = useRef();
  const noteRef = useRef();
  const date = new Date();
  console.log(totalExpenses);
  const testingDate = new Date(expenseObj.date);
  console.log(expenseObj);
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
  const saveExpense = async (monthlyExpenseArray) => {
    ////Simplified complex data ///////////////
    let updatedSelectedCategoryObj = {};
    let categoryObjIndex = null;
    let selectedCategoryObj = null;
    let currentIndex = null;
    let arrayLength = monthlyExpenseArray.length;
    let objIndex = arrayLength - 1;
    let currMonthObj = monthlyExpenseArray[arrayLength - 1];
    console.log(currMonthObj);
    let currMonthExpenseArray = currMonthObj.expenseArray;
    const currentMonth = new Date().getMonth();

    // Initial firestore data population /////////
    //?
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
                time: date.toLocaleTimeString(),
              },
            ],
            transactions: [
              {
                category: currCategory,
                expenseAmount: parseInt(amountRef.current.value),
                date: date.toDateString(),
                expenseNote: noteRef.current.value,
                time: date.toLocaleTimeString(),
              },
            ],
          },
        ],
        "expenseObj.date": date.toDateString(),
      });
      let newTotal =
        parseInt(totalExpenses) + parseInt(amountRef.current.value);
      await updateDoc(totalExpenseRef, {
        totalExpense: newTotal,
      });
      dispatch(GetExpenseObj());
      amountRef.current.value = "";
      noteRef.current.value = "";
      return;
    } else if (currentMonth !== new Date(expenseObj.date).getMonth()) {
      await updateDoc(expenseArrayRef, {
        "expenseObj.monthlyExpenses": [
          ...monthlyExpenseArray,
          {
            dateCreated: date.toDateString(),
            expenseArray: [
              {
                category: currCategory,
                expenseAmount: parseInt(amountRef.current.value),
                date: date.toDateString(),
                expenseNote: noteRef.current.value,
                time: date.toLocaleTimeString(),
              },
            ],
            transactions: [
              {
                category: currCategory,
                expenseAmount: parseInt(amountRef.current.value),
                date: date.toDateString(),
                expenseNote: noteRef.current.value,
                time: date.toLocaleTimeString(),
              },
            ],
          },
        ],
        "expenseObj.date": date.toDateString(),
      });
    } else if (currMonthExpenseArray.length >= 1) {
      const selectedCategoryObj = currMonthExpenseArray.find(
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
        const oldExpenseArray = currMonthExpenseArray;
        const newExpenseArray = [
          ...oldExpenseArray,
          {
            category: currCategory,
            expenseAmount: parseInt(amountRef.current.value),
            date: date.toDateString(),
            expenseNote: noteRef.current.value,
            time: date.toLocaleTimeString(),
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
              time: date.toLocaleTimeString(),
            },
          ],
        };
        monthlyExpenseArray[objIndex] = currMonthObj;
        await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenses": [...monthlyExpenseArray],
        });
        let newTotal =
          parseInt(totalExpenses) + parseInt(amountRef.current.value);
        await updateDoc(totalExpenseRef, {
          totalExpense: newTotal,
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
        updatedSelectedCategoryObj = {
          ...selectedCategoryObj,
          expenseAmount: newExpenseAmount,
        };
        const monthObjExpenseArray = [...monthlyExpenseArray];
        monthObjExpenseArray[categoryObjIndex] = updatedSelectedCategoryObj;
        const currCategoryObj = updatedSelectedCategoryObj;
        currMonthExpenseArray[categoryObjIndex] = currCategory;
        currMonthObj.expenseArray = currMonthExpenseArray;
        monthlyExpenseArray[objIndex] = currMonthObj;
        let newTotal =
          parseInt(totalExpenses) + parseInt(amountRef.current.value);
        await updateDoc(totalExpenseRef, {
          totalExpense: newTotal,
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
          onClick={() => saveExpense(allExpenseArray)}
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
