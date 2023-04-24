import React, { useRef, useState } from "react";
import styles from "./addCategory.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { CirclePicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSelectedCategoryColor,
  resetSelectedCategoryEmoji,
} from "../categoryComponent/categorySlice";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { GetCategories } from "../categoryComponent/categorySlice";
import Emojis from "../emojiFolder/emoji";
import { showEmoji } from "../categoryComponent/categorySlice";
import { showColorPicker } from "../categoryComponent/categorySlice";
import ColorPicker from "../colorPicker/colorPicker";
const AddCategory = () => {
  // const [showColorPicker, setShowColorPicker] = useState(false);
  const chartColor = useSelector((state) => state.categories.chartColor);
  const displayEmoji = useSelector((state) => state.categories.displayEmoji);
  const displayColorPicker = useSelector(
    (state) => state.categories.displayColorPicker
  );
  console.log(displayEmoji);
  const selectedCategoryEmoji = useSelector(
    (state) => state.categories.selectedCategoryEmoji
  );
  const userId = useSelector((state) => state.signUp.userId);
  console.log(userId);
  const categoryRef = doc(
    db,
    "users",
    `${userId}`,
    `categoryCollection`,
    `categories`
  );
  console.log(chartColor);
  const dispatch = useDispatch();
  const navigate = useDispatch();
  const categoryEmoji = useSelector(
    (state) => state.expense.selectedCategoryEmoji
  );
  console.log(chartColor);
  const categoryTitleRef = useRef();
  const categoryEmojiRef = useRef();
  const categoryColorRef = useRef();
  // console.log(categoryTitleRef.current.value);
  const handleDone = async () => {
    console.log(categoryTitleRef.current.value);
    const categoryName = categoryTitleRef.current.value;
    console.log(categoryName);
    await updateDoc(categoryRef, {
      categories: arrayUnion({
        categoryTitle: categoryName,
        categoryEmojiRef: selectedCategoryEmoji,
        chartColor: chartColor,
      }),
    }).then((res) => {
      dispatch(GetCategories(userId));
    });
    dispatch(resetSelectedCategoryColor());
    dispatch(resetSelectedCategoryEmoji());
    categoryTitleRef.current.value = "";
    categoryEmojiRef.current.value = "";
    categoryColorRef.current.value = "";
    // navigate("/category");
  };
  const displayEmojiHandler = () => {
    dispatch(showEmoji());
  };
  const displayColorPickerHandler = () => {
    dispatch(showColorPicker());
  };
  return (
    <div className={styles.addCategoryWrapper}>
      <nav className={styles.navContainer}>
        <Link to="/category" replace>
          X
        </Link>
        <button onClick={handleDone}>Done</button>
      </nav>
      <div className={styles.addCategoryContainer}>
        <div className={styles.categoryDetails}>
          <div className={styles.categoryName}>Name</div>
          <div className={styles.categoryIcon}>Icon</div>
          <div className={styles.categoryColor}>Chart Colour</div>
        </div>
        <div className={styles.inputsContainer}>
          <input
            className={styles.nameInputElement}
            ref={categoryTitleRef}
            placeholder="Name"
            type="text"
          />
          <div className={styles.linkContainer}>
            <div className={styles.colorDisplay} ref={categoryEmojiRef}>
              {selectedCategoryEmoji}
            </div>
            <Link
              to="/addCategory"
              onClick={displayEmojiHandler}
              replace
              className={styles.iconLink}
            >
              Select Icon
            </Link>
          </div>
          <div
            className={[styles.linkContainer, styles.selectColorLink].join(" ")}
          >
            <div
              ref={categoryColorRef}
              style={{ backgroundColor: `${chartColor}`, fontSize: "30px" }}
              className={styles.colorDisplay}
            ></div>
            <Link
              to="/addCategory"
              onClick={displayColorPickerHandler}
              replace
              className={styles.colorPickerLink}
            >
              Select color
            </Link>
          </div>
        </div>
      </div>
      {displayEmoji === true ? <Emojis /> : null}
      {displayColorPicker === true ? <ColorPicker /> : null}
    </div>
  );
};

export default AddCategory;
