import React from "react";
import styles from "./navComponent.module.scss";
import {
  HiCash,
  HiClipboardList,
  HiUserGroup,
  HiOutlineCollection,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMore, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { showMoreUI, hideMoreUI } from "../expenseDetails/expenseSlice";
import { AiFillPieChart, AiOutlinePieChart } from "react-icons/ai";
import { auth } from "../Firebase";
import { signOut } from "firebase/auth";
import { persistor } from "../store/store";
//
const NavComponent = () => {
  const onTransactionUI = useSelector(
    (state) => state.categories.onTransactionUI
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const displayMoreOptions = () => {};
  const navigateToCurrencyPage = () => {
    dispatch(hideMoreUI());
    navigate("/currencySelectionPage");
  };

  const signOutHandler = async (auth) => {
    console.log("Signed out!");
    persistor.purge();
    await signOut(auth);
  };
  const displayMoreUI = useSelector((state) => state.expense.displayMoreUI);
  return (
    <div className={styles.navComponentWrapper}>
      <div className={styles.dynamicAddBtnWrapper}>
        <Link
          className={styles.dynamicAddLink}
          to={onTransactionUI === true ? "/expenseTracker" : "/addCategory"}
          replace
        >
          <AiOutlinePlus />
        </Link>
        {/* <div> */}
        <AiOutlineMore
          className={styles.outlineMore}
          onClick={() => dispatch(showMoreUI())}
        />
        {/* </div> */}
      </div>
      <nav className={styles.navElement}>
        <Link to="/ExpenseSummary" replace className={styles.navLink}>
          <HiCash className={styles.navIcon} />
          <span className={styles.navTitle}>Spending</span>
        </Link>
        <Link to="/transactions" replace className={styles.navLink}>
          <HiClipboardList className={styles.navIcon} />
          <span className={styles.navTitle}>Transaction</span>
        </Link>
        <Link to="/category" replace className={styles.navLink}>
          <HiOutlineCollection className={styles.navIcon} />
          <span className={styles.navTitle}>Categories</span>
        </Link>
        <Link to="/expenseChart" replace className={styles.navLink}>
          <AiOutlinePieChart className={styles.navIcon} />
          <span className={styles.navTitle}>Expense Chart</span>
        </Link>
      </nav>
      {/* <Outlet /> */}
      <div
        className={
          displayMoreUI === true ? styles.moreOptionsWrapper : styles.hidden
        }
        onClick={() => dispatch(hideMoreUI())}
      >
        {/* <div className={styles.shortCutWrapper}> */}
        <ul className={styles.list}>
          <li className={[styles.linkItem, styles.closeUIwrapper].join(" ")}>
            <AiOutlineClose
              className={styles.closeUIIcon}
              onClick={() => dispatch(hideMoreUI())}
            />
          </li>
          <li className={styles.linkItem}>
            <div
              onClick={navigateToCurrencyPage}
              replace
              className={styles.currencySymbolSelectionLink}
            >
              Select Currency
            </div>
          </li>
          <li className={styles.linkItem}>
            <div
              // onClick={navigateToSettingsPage}
              replace
              className={styles.currencySymbolSelectionLink}
              onClick={signOutHandler}
            >
              Log out
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavComponent;
