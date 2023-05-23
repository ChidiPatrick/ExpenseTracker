import React, { useState } from "react";
import styles from "./expenseDetails.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const PopUP = () => {
  //   const [hidePopUp, setHidePopUP] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closePopUp = () => {
    // dispatch(hidePopUp());
  };
  return (
    <div className={styles.popUpMessageWrapper}>
      <div className={styles.innerWrapper}>
        <h3 className={styles.popUpHeading}>Alert:</h3>
        <p className={styles.popParagraph}>
          No Salary or Bugdet added. <br />
          <br />
          Add Salary/Bugdet{" "}
          <Link className={styles.addSalaryLink} to="/addIncome" replace>
            Add
          </Link>
        </p>
        <div className={styles.btnWrapper}>
          <button onClick={closePopUp} className={styles.btnClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUP;
