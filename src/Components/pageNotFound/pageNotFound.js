import React from "react";
import styles from "./pageNotFound.module.scss";

const PageNotFound = () => {
  return (
    <div className={styles.PageNotFoundWrapper}>
      <h1>
        <span>404 Error</span>
        <span>Page not found</span>
      </h1>
    </div>
  );
};
export default PageNotFound;
