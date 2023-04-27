import React, { useRef } from "react";
import styles from "./addIncome.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateDoc, doc } from "firebase/firestore";
const AddIncome = () => {
  const date = new Date();
  const amountRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.signUp.userId);
  const salaryRef = doc(`users,${userId},salaryCollection,salaryArray`);

  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <Link to={"/"}>X</Link>
        <button
          className={styles.saveBtn}
          // onClick={() => saveExpense(expenseArray)}
        >
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
              ref={amountRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddIncome;
