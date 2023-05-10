import React from "react";
import styles from "./currencySelector.module.scss";
import currencyToSymbolMap from "currency-symbol-map/map";
import { getCurrencySymbol } from "../expenseDetails/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import NavComponent from "../navigationComponent/navComponent";
import { useNavigate } from "react-router";
/////////////////////////////////////////////
const CurrencySelector = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.signUp.userId);
  const currencyObj = currencyToSymbolMap;
  const currCurrencySymbol = useSelector(
    (state) => state.expense.currencySymbol
  );
  console.log(currCurrencySymbol);
  const currencyArray = Object.values(currencyObj);
  const currencySymbolRef = doc(
    db,
    "users",
    `${userId}`,
    `expenseCollection`,
    `expenses`
  );
  console.log(userId);
  const updateCurrencySymbol = async (userId, newCurrencySymbol) => {
    const currencySymbolRef = doc(
      db,
      "users",
      `${userId}`,
      `expenseCollection`,
      `expenses`
    );
    console.log("cALLED");
    await updateDoc(currencySymbolRef, {
      currencySymbol: newCurrencySymbol,
    });
    console.log("Got here");
    dispatch(getCurrencySymbol(newCurrencySymbol));
  };

  return (
    <div className={styles.parentWrapper}>
      <NavComponent />
      <div onClick={() => navigate(-1)}>X</div>
      <h2 className={styles.currencySymbolHeader}>Currency Symbol</h2>
      <div className={styles.countryAndCurrency}>
        {currencyArray.map((currency, index) => {
          if (index === 6) {
            return (
              <div className={styles.currencySymbolWrapper} key={index}>
                <input
                  className={styles.currencyInput}
                  type="radio"
                  name="currency"
                  value={currency}
                  id={`radio${index}`}
                />
                <label
                  htmlFor={`radio${index}`}
                  className={styles.currencyLabel}
                  onClick={() => updateCurrencySymbol(userId, currency)}
                >
                  {currency}
                </label>
              </div>
            );
          }
          return (
            <div className={styles.currencySymbolWrapper} key={index}>
              <input
                className={styles.currencyInput}
                type="radio"
                name="currency"
                value={currency}
                id={`radio${index}`}
              />
              <label
                htmlFor={`radio${index}`}
                className={styles.currencyLabel}
                onClick={() => updateCurrencySymbol(userId, currency)}
              >
                {currency}
              </label>
            </div>
          );
        })}
      </div>
      <div className={styles.cancelBtnWrapper}>
        <button className={styles.cancelBtn}>CANCEL</button>
      </div>
    </div>
  );
};
export default CurrencySelector;
