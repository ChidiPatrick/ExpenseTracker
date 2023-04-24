import React from "react";
import styles from "./navComponent.module.scss";
import {
  HiCash,
  HiClipboardList,
  HiUserGroup,
  HiOutlineCollection,
} from "react-icons/hi";
import { Link } from "react-router-dom";
const NavComponent = () => {
  return (
    <div className={styles.navComponentWrapper}>
      <nav className={styles.navElement}>
        <Link to="/" replace className={styles.navLink}>
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
        <Link className={styles.navLink}>
          <HiUserGroup className={styles.navIcon} />
          <span className={styles.navTitle}>Categories</span>
        </Link>
      </nav>
      {/* <Outlet /> */}
    </div>
  );
};

export default NavComponent;
