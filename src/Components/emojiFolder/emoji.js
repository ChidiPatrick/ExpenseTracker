import React from "react";
import styles from "./emoji.module.scss";
import EmojiPicker from "emoji-picker-react";
import { setCategoryEmoji } from "../categoryComponent/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { hideEmoji } from "../categoryComponent/categorySlice";
import { HiXMark } from "react-icons/hi2";
const Emojis = () => {
  const dispatch = useDispatch();
  const handleEmojiClick = (emojidata) => {
    console.log(emojidata.emoji);
    dispatch(setCategoryEmoji(emojidata.emoji));
    dispatch(hideEmoji());
  };
  const closeEmojiUI = () => {
    dispatch(hideEmoji());
  };
  return (
    <div className={styles.emojiWrapper}>
      <div className={styles.emojiContainerWrapper}>
        <nav className={styles.emojiNav}>
          <span className={styles.closeEmoji} onClick={closeEmojiUI}>
            <HiXMark className={styles.cancleBtn} />
          </span>
        </nav>
        <EmojiPicker onEmojiClick={handleEmojiClick} width={"100%"} />
      </div>
    </div>
  );
};
export default Emojis;
