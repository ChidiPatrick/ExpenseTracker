import React from "react";
import styles from "./spinner.module.scss";
const Spinner = () => {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.ldsring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Spinner;
