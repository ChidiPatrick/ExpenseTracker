import React, { startTransition, useState } from "react";
import styles from "./colorPicker.module.scss";
import { CirclePicker } from "react-color";
import { setChartColor } from "../categoryComponent/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { hideColorPicker } from "../categoryComponent/categorySlice";
const ColorPicker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currColor = useSelector((state) => state.expense.chartColor);
  const [color, setColor] = useState("#fff");
  const handleColorChange = (color, event) => {
    setColor(color.hex);
    dispatch(setChartColor(color.hex));
    dispatch(hideColorPicker());
  };
  const handleCancle = () => {
    dispatch(hideColorPicker());
  };
  return (
    <div className={styles.colorPickerWrapper}>
      <div className={styles.colorPickerContainer}>
        <div className={styles.colorPickerHeader}>Color Picker</div>
        <CirclePicker onChange={handleColorChange} />
        <div className={styles.btnsWrapper}>
          <button onClick={handleCancle} className={styles.colorBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ColorPicker;
