import React, { startTransition, useState } from "react";
import styles from "./colorPicker.module.scss";
import { SketchPicker } from "react-color";
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
    console.log(color.hex);
    setColor(color.hex);
  };
  const handleColorChangeComplete = (color, event) => {
    dispatch(setChartColor(color.hex));
  };
  const handleCancle = () => {
    dispatch(hideColorPicker());
  };
  return (
    <div className={styles.colorPickerWrapper}>
      <div className={styles.colorPickerContainer}>
        <div onClick={handleCancle} className={styles.closeUI}>
          X
        </div>
        <div className={styles.colorPickerHeader}>Pick a Color</div>
        <SketchPicker
          color={color}
          onChange={handleColorChange}
          onChangeComplete={handleColorChangeComplete}
          style={{ width: "300px" }}
        />
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
