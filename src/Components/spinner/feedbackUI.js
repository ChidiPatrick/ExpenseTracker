import React from "react";
import styles from "./spinner.module.scss";
import { useNavigate } from "react-router";
const FeedBackUI = () => {
  const navigate = useNavigate();
  return (
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
};

export default FeedBackUI;
