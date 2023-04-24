import React, { Ref } from "react";
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
// BsGiftFill
// BsMusicPlayerFill
///////////////---CATEGORY COMPONENT---/////////////////
const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoriesObj = useSelector(
    (state) => state.categories.categoriesArray
  );
  const categories = categoriesObj.categories;

  console.log(categories);
  ////// Get Category //////////////////
  const getCategory = (e) => {
    console.log(e.target.innerText);
    dispatch(getSelectedCategory(e.target.innerText));
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
      <nav className={styles.categoryNav}>
        <Link to="/addCategory" replace className={styles.backLink}>
          +
        </Link>
      </nav>
      <NavComponent />
      {/* <div className={styles.categories}>
        <div className={styles.Category} onClick={getCategory}>
          <ImSpoonKnife className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Eating out</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <BsFillFuelPumpFill className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Fuel</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <IoIosShirt className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Clothes</div>
        </div>

        <div className={styles.Category} onClick={getCategory}>
          <BsMusicPlayerFill className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Entainment</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <BsGiftFill className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Gifts</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <FaChild className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Kids</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <HiBriefcase className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Holidays</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <BsCart4 className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Shopping</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <MdDirectionsRun className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Sports</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <MdDirectionsBus className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Travel</div>
        </div>
        <div className={styles.Category} onClick={getCategory}>
          <ImTv className={styles.categoryIcon} />
          <div className={styles.categoryTitle}>Movies</div>
        </div>
</div> */}
      <div className={styles.categories}>
        {categories.length >= 1
          ? categories.map((category, index) => {
              return (
                <div
                  className={styles.Category}
                  key={index}
                  onClick={getCategory}
                >
                  <div className={styles.categoryIcon}>
                    {category.categoryEmojiRef}
                  </div>
                  <div className={styles.categoryTitle}>
                    {category.categoryTitle}
                  </div>
                </div>
              );
            })
          : noCategoryUI}
      </div>
    </div>
  );
};

export default Category;
