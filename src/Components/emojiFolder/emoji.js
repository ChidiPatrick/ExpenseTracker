import React from "react";
import styles from "./emoji.module.scss";
import EmojiPicker from "emoji-picker-react";
const Emojis = () => {
  const handleEmojiClick = (emojidata) => {
    console.log(emojidata);
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
