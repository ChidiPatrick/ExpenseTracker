import React, { useEffect, useState } from "react";
import styles from "./spinner.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showFeedBackMessage } from "../expenseDetails/expenseSlice";
const Spinner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showFeedBackUI = useSelector((state) => state.expense.showFeedBackUI);
  useEffect(() => {
    setTimeout(() => dispatch(showFeedBackMessage()), 20000);
  }, [showFeedBackUI]);
  /////////////////////////////////////////////////////////////////////
  /////// FEEDBACK MESSAGE UI /////////////////
  const feedBackUI = (
    <div className={styles.feedBackUIWrapper}>
      <div className={styles.feedBackMessageInnerContainer}>
        <h2 className={styles.feedbackMessageHeader}>
          <span className={styles.biggerHeader}>Ooops!</span>
          <span className={styles.smallerHeader}>Connectivity Issue</span>
        </h2>
        <p className={styles.messageParagraph}>
          Please check your internet connection and try again
        </p>
        <div className={styles.btnWrapper}>
          <button onClick={() => navigate(0)} className={styles.refreshPageBtn}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
  /////////////// SPINNER UI ///////////////////////////////////
  const spinner = (
    <div className={styles.spinnerWrapper}>
      <div className={styles.ldsring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
  return showFeedBackUI === false ? spinner : feedBackUI;
};
export default Spinner;
