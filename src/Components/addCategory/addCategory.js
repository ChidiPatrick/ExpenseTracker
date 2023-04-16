import React from "react";
import styles from "./addCategory.module.scss";
import { Link } from "react-router-dom";
import { CirclePicker } from "react-color";
const AddCategory = () => {
  return (
    <div className={styles.addCategoryWrapper}>
      <nav className={styles.navContainer}>
        <Link to="category">X</Link>
        <button>Done</button>
      </nav>
      <div className={styles.addCategoryContainer}>
        <div className={styles.categoryDetails}>
          <div className={styles.categoryName}>Name</div>
          <div className={styles.categoryIcon}>Icon</div>
          <div className={styles.categoryColor}>Chart Colour</div>
        </div>
        <div className={styles.inputsContainer}>
          <input className={styles.nameInputElement} placeholder="Name" />
          <div className={styles.linkContainer}>
            <Link to="icons" className={styles.iconLink}>
              Select Icon
            </Link>
          </div>
          <div className={styles.linkContainer}>
            <Link to="colorPicker" className={styles.colorPickerLink}>
              Select color
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.colorPickerWrapper}>
        <div className={styles.colorPickerContainer}>
          <div className={styles.colorPickerHeader}>Color Picker</div>
          <CirclePicker />
          <div className={styles.btnsWrapper}>
            <button>Cancel</button>
            <button>Select</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
