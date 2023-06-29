import React from "react";
import styles from "./smallSpinner.module.scss";
const SmallSpinner = ({ showUI }) => {
  return (
    <div className={showUI === true ? styles.spinnerWrapper : styles.hidden}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.ldsring}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SmallSpinner;
