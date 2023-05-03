import React from "react";
import styles from "./currencySelector.module.scss";
import currencyToSymbolMap from "currency-symbol-map/map";
import { getCurrencySymbol } from "../expenseDetails/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
/////////////////////////////////////////////
const CurrencySelector = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.signUp.userId);
  const currencyObj = currencyToSymbolMap;

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
    <div>
      <h2>Currency Symbol</h2>
      <div className={styles.countryAndCurrency}>
        {currencyArray.map((currency, index) => {
          if (index === 6) {
            return (
              <div className={styles.currencySymbolWrapper}>
                <input
                  className={styles.currencyInput}
                  type="radio"
                  name="currency"
                  key={index}
                  value={currency}
                  defaultChecked
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
            <div className={styles.currencySymbolWrapper}>
              <input
                className={styles.currencyInput}
                type="radio"
                name="currency"
                key={index}
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
        <button>CANCEL</button>
      </div>
    </div>
  );
};
export default CurrencySelector;
