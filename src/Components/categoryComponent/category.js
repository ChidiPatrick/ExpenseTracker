import React, { Ref } from "react";
import styles from "./category.module.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedCategory } from "./categorySlice";

///////////////---CATEGORY COMPONENT---/////////////////
const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCategory = (e) => {
    console.log(e.target.innerText);
    dispatch(getSelectedCategory(e.target.innerText));
    navigate(-1);
  };
  return (
    <div className={styles.categoryContainer}>
      <nav className={styles.categoryNav}>
        <Link className={styles.backLink}>X</Link>
      </nav>
      <div className={styles.categories}>
        <div className={styles.Category} onClick={getCategory}>
          Eating out
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Fuel
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Clothes
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Miscellaneous
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Entainment
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Gifts
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Kids
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Holidays
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Shopping
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Sports
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Travel
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Movies
        </div>
        <div className={styles.Category} onClick={getCategory}>
          Accommodation
        </div>
      </div>
    </div>
  );
};

export default Category;
