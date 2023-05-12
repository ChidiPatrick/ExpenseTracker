import React, { Ref, useRef } from "react";
import styles from "./category.module.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedCategory } from "./categorySlice";
import { getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { HiGift, HiShoppingCart, HiTag, HiBriefcase } from "react-icons/hi";
import { ImTv, ImSpoonKnife } from "react-icons/im";
import { IoIosBody, IoIosBus, IoIosShirt } from "react-icons/io";
import { MdDirectionsRun, MdDirectionsBus } from "react-icons/md";
import { BsFillFuelPumpFill, BsCart4 } from "react-icons/bs";
import { FaChild } from "react-icons/fa";
import { BsGiftFill, BsMusicPlayerFill } from "react-icons/bs";
import NavComponent from "../navigationComponent/navComponent";
import AddIncome from "../addIncome/addIncome";
// BsGiftFill
// BsMusicPlayerFill
///////////////---CATEGORY COMPONENT---/////////////////
const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryTitleRef = useRef();
  const categoriesObj = useSelector(
    (state) => state.categories.categoriesArray
  );
  const categories = categoriesObj.categories;
  console.log(categories);
  ////// Get Category //////////////////
  const getCategory = (e) => {
    console.log(e.target.innerText);
    dispatch(getSelectedCategory(e.target.innerText));
    console.log(categoryTitleRef);
    navigate("/expenseTracker");
  };
  const noCategoryUI = (
    <div className={styles.noCategoryUI}>
      <div className={styles.categoryMessageWrapper}>
        No categories added
        <br />
        Add category
      </div>
      <Link to="/addCategory" replace className={styles.addCategoryBtn}>
        + Add Category
      </Link>
    </div>
  );
  return (
    <div className={styles.categoryContainer}>
      {/* <nav className={styles.categoryNav}>
        <Link to="/addCategory" replace className={styles.backLink}>
          +
        </Link>
      </nav> */}
      <NavComponent />
      <div className={styles.categories}>
        {categories !== undefined
          ? categories.map((category, index) => {
              return (
                <div className={styles.Category} key={index}>
                  <div className={styles.categoryIcon}>
                    {category.categoryEmojiRef}
                  </div>
                  <div
                    ref={categoryTitleRef}
                    onClick={getCategory}
                    className={styles.categoryTitle}
                  >
                    {category.categoryTitle}
                  </div>
                </div>
              );
            })
          : noCategoryUI}
      </div>
      <AddIncome />
    </div>
  );
};

export default Category;
