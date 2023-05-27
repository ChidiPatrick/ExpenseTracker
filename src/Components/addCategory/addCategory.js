import React, { useEffect, useRef, useState } from "react";
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
import { activateBtn, deactivateBtn } from "../categoryComponent/categorySlice";
import { HiXMark } from "react-icons/hi2";
const AddCategory = () => {
  // const [showColorPicker, setShowColorPicker] = useState(false);
  const categoryTitleRef = useRef();
  const categoryEmojiRef = useRef();
  const categoryColorRef = useRef();
  const chartColor = useSelector((state) => state.categories.chartColor);
  const displayEmoji = useSelector((state) => state.categories.displayEmoji);
  const displayColorPicker = useSelector(
    (state) => state.categories.displayColorPicker
  );
  const [formCompleteFeedBackMSG, setFormCompleteFeedbackMSG] = useState(false);
  console.log(displayEmoji);
  const selectedCategoryEmoji = useSelector(
    (state) => state.categories.selectedCategoryEmoji
  );
  const showDoneBtn = useSelector((state) => state.categories.bntActive);
  const userId = useSelector((state) => state.signUp.userId);
  console.log(showDoneBtn);
  let counter = 0;

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

  // console.log(categoryTitleRef.current.value);
  const handleDone = async () => {
    if (
      chartColor === "" ||
      categoryEmojiRef.current.innerText === "" ||
      categoryTitleRef.current.value === ""
    ) {
      console.log("Form not completely filled!");
      setFormCompleteFeedbackMSG(true);
      return;
    } else {
      setFormCompleteFeedbackMSG(false);
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
    }
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
          <HiXMark className={styles.cancleBtn} />
        </Link>
        <button className={styles.btnDone} onClick={handleDone}>
          Done
        </button>
      </nav>
      {displayEmoji === true ? <Emojis /> : null}
      {displayColorPicker === true ? <ColorPicker /> : null}
      <div
        className={
          formCompleteFeedBackMSG === true
            ? styles.formFeedbackMsg
            : styles.hidden
        }
      >
        Please fill out the form completely
      </div>
      <div className={styles.practiceContainer}>
        <div className={styles.categoryName}>Name</div>
        <input
          className={styles.nameInputElement}
          ref={categoryTitleRef}
          placeholder="Name"
          type="text"
        />
        <div className={styles.categoryIcon}>Icon</div>
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
        <div className={styles.categoryColor}>Chart Colour</div>
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
  );
};

export default AddCategory;
