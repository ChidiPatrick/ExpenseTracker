import React, { useRef } from "react";
import styles from "./addIncome.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
const AddIncome = () => {
  const date = new Date();
  const salaryAmountRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salary = useSelector((state) => state.expense.salary);
  const userId = useSelector((state) => state.signUp.userId);
  const salaryRef = doc(
    db,
    `users`,
    `${userId}`,
    `salaryCollection`,
    `salaries`
  );
  const addSalary = async (salary) => {
    let oldSalaryAmount = salary;
    const newSalary =
      parseFloat(oldSalaryAmount) + parseFloat(salaryAmountRef.current.value);
    await updateDoc(salaryRef, {
      salary: newSalary,
    });
  };
  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <Link to={"/"}>X</Link>
        <button className={styles.saveBtn} onClick={() => addSalary(salary)}>
          Done
        </button>
      </div>
      <div className={styles.detailsParentContainer}>
        <div className={styles.expenseDetailsContainer}>
          <div className={styles.detailsLeft}>
            <div className={styles.date}>Date</div>
            <div className={styles.amount}>Amount</div>
          </div>
          <div className={styles.detailsRight}>
            <div className={styles.currentDate}>{date.toDateString()}</div>
            {/* <Link
            to="/category"
            className={styles.categoryLink}
            ref={categoryRef}
          >
            {currCategory === "" ? "Enter category" : currCategory}
          </Link> */}
            <input
              className={styles.inputElement}
              placeholder=" Enter Salary"
              type="number"
              ref={salaryAmountRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddIncome;
