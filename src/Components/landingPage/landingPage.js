import React, { useState } from "react";
import styles from "./landingPage.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import FeedBackUI from "../spinner/feedbackUI";
import { useDispatch } from "react-redux";
import {
  GetSalary,
  getUser,
  GetExpenseObj,
} from "../expenseDetails/expenseSlice";
import {
  GetCategories,
  getTotalExpenses,
} from "../categoryComponent/categorySlice";
import { getUserId } from "../signUpComponent/signUpSlice";
import Spinner from "../spinner/spinner";
const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFeedbackUI, setShowFeedbackUI] = useState(false);
  const handleSignIn = async (values) => {
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then((res) => {
        console.log(res);
        if (res.user) {
          dispatch(getUser(res.user));
          dispatch(getUserId(res.user.uid));
          dispatch(GetCategories(res.user.uid));
          dispatch(GetExpenseObj(res.user.uid));
          dispatch(GetSalary(res.user.uid));
          dispatch(getTotalExpenses(res.user.uid));
          console.log("Submitted!");
          navigate("/ExpenseSummary");
        } else {
          navigate("/signUpPage");
        }
      })
      .catch((err) => {
        console.log(err);
        setShowFeedbackUI(true);
      });
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 alpha-numeric characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      handleSignIn(values);
    },
  });

  return showFeedbackUI === true ? (
    <FeedBackUI />
  ) : (
    <div className={styles.landingPageWrapper}>
      <header className={styles.landingPageHeader}>
        <h1 className={styles.heading}>
          "WHAT GETS <span className={styles.measured}>MEASURED</span>,<br />
          GETS<span className={styles.getsManaged}> MANAGED.</span>
          <br />
          <span className={styles.track}>TRACK</span> YOUR{" "}
          <span className={styles.expenses}>EXPENSES</span>"
        </h1>
        <div className={styles.originator}>
          <span>Patrick Chidi</span>
        </div>
      </header>
      <form onSubmit={formik.handleSubmit} className={styles.signInForm}>
        <label htmlFor="firstName" className={styles.label}>
          <span className={styles.signUpLabelTitle}>Email</span>
          <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            id="email"
            className={styles.inputElement}
            type="email"
            required
            value={formik.values.email}
            placeholder="yourEmail@gmail.com"
            name="email"
          />
        </label>
        {formik.errors.email ? (
          <div className={styles.required}>{formik.errors.email}</div>
        ) : null}
        <label htmlFor="firstName" className={styles.label}>
          <span className={styles.signUpLabelTitle}>Password</span>
          <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            id="password"
            className={styles.inputElement}
            type="password"
            required
            value={formik.values.password}
            placeholder="strongPassword239!"
            name="password"
          />
        </label>
        {formik.errors.password ? (
          <div className={styles.required}>{formik.errors.password}</div>
        ) : null}
        <div className={styles.linksWrapper}>
          <div className={styles.innerWrapper}>
            <input type="submit" value="Log In" className={styles.logInBtn} />

            <Link className={styles.signUpLink} to="/signUpPage" replace>
              Sign Up
            </Link>
          </div>
          <div className={styles.forgottenPasswordWrapper}>
            <Link
              to={"/resetPassword"}
              replace
              className={styles.forgottenPassword}
            >
              Forgotten Password?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LandingPage;
