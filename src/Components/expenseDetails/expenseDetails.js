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

// import LandingPage from "../landingPage/landingPage";
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
  const monthlyExpenseArray = [...allMonthExpenseArray];
  const currCategory = useSelector((state) => state.categories.currCategory);
  const salary = useSelector((state) => state.expense.salary);
  const totalExpenses = useSelector((state) => state.categories.totalExpense);
  const expenseObj = useSelector((state) => state.expense.expenseObj);
  const currCategoryColor = useSelector(
    (state) => state.categories.currCategoryColor
  );
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
  /////////////////////////////////////////////
  ///////// HANDLERS ///////////////////////////
  const updateMonthlyExpenseObjArray = async (newMonthlyExpenseArray) => {
    let monthlyExpensesObjArray = [...newMonthlyExpenseArray];
    await updateDoc(expenseArrayRef, {
      "expenseObj.monthlyExpenses": newMonthlyExpenseArray,
    });
  };
  const updateTotalExpenseAmount = async (newTotalExpense) => {
    await updateDoc(totalExpenseRef, {
      totalExpense: newTotalExpense,
    });
  };
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = async (
    monthlyExpenseArray,
    totalExpenses,
    currCategoryColor
  ) => {
    ////Simplified complex data ///////////////
    let updatedSelectedCategoryObj = {};
    let categoryObjIndex = null;
    let selectedCategoryObj = null;
    let currentIndex = null;
    let arrayLength = monthlyExpenseArray.length;
    let objIndex = arrayLength - 1;
    let currMonthObj = { ...monthlyExpenseArray[arrayLength - 1] };
    console.log(currMonthObj);
    let currMonthExpenseArray = [...currMonthObj.expenseArray];
    let currMonthTransactions = [...currMonthObj.transactions];
    const currentMonth = new Date().getMonth();

    // Initial firestore data population /////////
    //////////////////////////////////////////////
    ///////////////////////////////////////////////
    // Check out why firestore is not updating properly
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
                categoryColor: currCategoryColor,
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
                categoryColor: currCategoryColor,
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
        const updatedCurrMonthExpenseArray = [
          ...oldExpenseArray,
          {
            category: currCategory,
            expenseAmount: parseInt(amountRef.current.value),
            date: date.toDateString(),
            expenseNote: noteRef.current.value,
            time: date.toLocaleTimeString(),
            categoryColor: currCategoryColor,
          },
        ];
        //////// Update current month expensArray and monthlyExpenseArray ///////
        const updatedCurrMonthExpenseObj = {
          ...currMonthObj,
          expenseArray: [...updatedCurrMonthExpenseArray],
          transactions: [
            ...currMonthTransactions,
            {
              category: currCategory,
              expenseAmount: parseInt(amountRef.current.value),
              date: date.toDateString(),
              expenseNote: noteRef.current.value,
              time: date.toLocaleTimeString(),
            },
          ],
        };
        console.log(monthlyExpenseArray);
        const newMonthlyExpenseArray = [...monthlyExpenseArray];
        newMonthlyExpenseArray[objIndex] = updatedCurrMonthExpenseObj;
        console.log(newMonthlyExpenseArray);
        const data = {
          "expenseObj.monthlyExpenses": [...newMonthlyExpenseArray],
        };
        await updateDoc(expenseArrayRef, data);
        // updateMonthlyExpenseObjArray(newMonthlyExpenseArray);
        console.log("got here!");
        let newTotal =
          parseInt(totalExpenses) + parseInt(amountRef.current.value);
        console.log(newTotal);
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
        console.log("Selected category object is shown below:");
        console.log(selectedCategoryObj);
        const newExpenseAmount =
          parseInt(selectedCategoryObj.expenseAmount) +
          parseInt(amountRef.current.value);
        console.log(
          "Old expense amount: " + " " + selectedCategoryObj.expenseAmount
        );
        console.log("New expense amount: " + " " + newExpenseAmount);
        updatedSelectedCategoryObj = {
          ...selectedCategoryObj,
          date: date.toDateString(),
          expenseAmount: newExpenseAmount,
        };
        const newTransactionArray = [
          ...currMonthTransactions,
          {
            category: currCategory,
            expenseAmount: parseInt(amountRef.current.value),
            date: date.toDateString(),
            expenseNote: noteRef.current.value,
            time: date.toLocaleTimeString(),
          },
        ];
        let currMonthObjExpenseArray = [...currMonthExpenseArray];
        currMonthObjExpenseArray[categoryObjIndex] = updatedSelectedCategoryObj;
        // const currCategoryObj = updatedSelectedCategoryObj;
        // const currMonthCategoryObj =
        // currMonthExpenseArray[categoryObjIndex] = currCategoryObj;
        currMonthObj.expenseArray = currMonthObjExpenseArray;
        currMonthObj.transactions = newTransactionArray;
        let updatedMonthlyExpenseArray = [...monthlyExpenseArray];
        console.log("Monthly Expense array Before updating ");
        console.log(updatedMonthlyExpenseArray);
        updatedMonthlyExpenseArray[objIndex] = currMonthObj;
        console.log("Monthly Expense array after updating ");
        console.log(updatedMonthlyExpenseArray);
        let newTotal =
          parseInt(totalExpenses) + parseInt(amountRef.current.value);
        await updateDoc(totalExpenseRef, {
          totalExpense: newTotal,
        });

        dispatch(updateExpenseArray(updatedMonthlyExpenseArray));
        dispatch(addExpense(amountRef.current.value));
        dispatch(GetSalary(userId));
        dispatch(getSelectedCategory(""));
        await updateDoc(expenseArrayRef, {
          "expenseObj.monthlyExpenses": [...updatedMonthlyExpenseArray],
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
          onClick={() =>
            saveExpense(monthlyExpenseArray, totalExpenses, currCategoryColor)
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
