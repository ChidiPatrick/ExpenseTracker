import React, { useRef } from "react";
import styles from "./expenseDetails.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseObj, addExpense, updateExpenseArray } from "./expenseSlice";
import SignUpComponent from "../signUpComponent/signUp";
import { getSelectedCategory } from "../categoryComponent/categorySlice";
//////////////////////////////////////////////////////////////////////////
/////Expense Details Component/////////////////////
const ExpenseDetails = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.expense.expenseArray);
  console.log(categories);
  const currCategory = useSelector((state) => state.categories.currCategory);
  const categoryRef = useRef();
  const amountRef = useRef();
  const date = new Date();
  ////////////Save Entered Expense //////////////////////////
  const saveExpense = () => {
    ////Check for existing category ///////////////
    let updatedSelectedCategoryObj = {};

    const selectedCategory = categories.find(
      (categoryObj) => categoryObj.category === currCategory
    );
    ///Add New Category if it doesn't exist/////////////
    console.log(selectedCategory);
    if (selectedCategory === undefined) {
      dispatch(
        getExpenseObj({
          category: currCategory,
          expenseAmount: parseInt(amountRef.current.value),
          date: date.toDateString(),
        })
      );
      dispatch(addExpense(amountRef.current.value));
      dispatch(getSelectedCategory(""));
      amountRef.current.value = "";
      return;
    }
    ///////// Update category if it exists //////////////////////
    else {
      const newCategories = categories.filter(
        (categoryObj) => categoryObj.category !== currCategory
      );
      const newExpenseAmount =
        selectedCategory.expenseAmount + parseInt(amountRef.current.value);
      updatedSelectedCategoryObj = {
        ...selectedCategory,
        expenseAmount: newExpenseAmount,
      };
      newCategories.push(updatedSelectedCategoryObj);
      dispatch(updateExpenseArray(newCategories));
      dispatch(addExpense(amountRef.current.value));
      dispatch(getSelectedCategory(""));
      amountRef.current.value = "";
    }
  };
  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <Link to={"/"}>X</Link>
        <button className={styles.saveBtn} onClick={saveExpense}>
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
              to="category"
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
