import React from "react";
import styles from "./emoji.module.scss";
import EmojiPicker from "emoji-picker-react";
import { setCategoryEmoji } from "../categoryComponent/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { hideEmoji } from "../categoryComponent/categorySlice";
const Emojis = () => {
  const dispatch = useDispatch();
  const handleEmojiClick = (emojidata) => {
    console.log(emojidata.emoji);
    dispatch(setCategoryEmoji(emojidata.emoji));
    dispatch(hideEmoji());
  };
  return (
    <div className={styles.emojiWrapper}>
      <nav className={styles.emojiNav}>
        <span>back</span>
        <h3 className={styles.emojiHeader}>Icons</h3>
      </nav>
      <div className={styles.emojiContainerWrapper}>
        <EmojiPicker onEmojiClick={handleEmojiClick} width={"100%"} />
      </div>
    </div>
  );
};
export default Emojis;
