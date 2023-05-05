import React from "react";
import styles from "./signUp.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../Firebase";
////////////////////////////////////////////////////////
const SignupForm = () => {
  // const userId = useSelector((state) => state.signup.userId);
  const date = new Date();
  const createExpenseCollection = async (userId) => {
    const expenseDetailsRef = doc(
      db,
      "users",
      `${userId}`,
      `expenseCollection`,
      `expenses`
    );
    await setDoc(expenseDetailsRef, {
      expenseObj: {
        date: date.toDateString(),
        monthlyExpenseArray: [],
        transactionArray: [],
      },
      currencySymbol: "$",
    });
  };
  const createSalaryCollection = async (userId) => {
    const salaryRef = doc(
      db,
      "users",
      `${userId}`,
      `salaryCollection`,
      `salaries`
    );
    await setDoc(salaryRef, {
      salary: 0,
      totalExpense: 0,
    });
  };

  const addCateGories = async (userId) => {
    console.log("addCategory function called!");
    const categoryRef = doc(
      db,
      "users",
      `${userId}`,
      `categoryCollection`,
      `categories`
    );

    await setDoc(categoryRef, {
      categories: [],
    });
  };
  const signUpUser = async (values) => {
    try {
      let userId = "";
      await createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((res) => {
          addCateGories(res.user.uid);
          userId = res.user.uid;
        })
        .then((res) => {
          createExpenseCollection(userId);
        })
        .then((res) => {
          createSalaryCollection(userId);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 alpha-numeric characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Submitted!");
      signUpUser(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className={styles.userForm}>
      <label htmlFor="firstName" className={styles.label}>
        <span className={styles.signUpLabelTitle}>First name</span>
        <input
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="firstName"
          className={styles.userFirstName}
          type="text"
          required
          value={formik.values.firstName}
          name="firstName"
        />
      </label>
      {formik.errors.firstName ? (
        <div className={styles.required}>{formik.errors.firstName}</div>
      ) : null}
      <label htmlFor="lastName" className={styles.label}>
        <span className={styles.signUpLabelTitle}>Last name</span>
        <input
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="lastName"
          className={styles.userLastName}
          type="text"
          required
          value={formik.values.lastName}
          name="lastName"
        />
      </label>
      {formik.errors.firstName ? (
        <div className={styles.required}>{formik.errors.lastName}</div>
      ) : null}
      <label htmlFor="email" className={styles.label}>
        <span className={styles.signUpLabelTitle}>email</span>
        <input
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="email"
          className={styles.userEmail}
          required
          value={formik.values.email}
          name="email"
        />
      </label>
      {formik.errors.firstName ? (
        <div className={styles.required}>{formik.errors.email}</div>
      ) : null}
      <label htmlFor="password" className={styles.label}>
        <span className={styles.signUpLabelTitle}>Password</span>
        <input
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="password"
          placeholder="Yourpassword9!@#?"
          className={styles.userPassword}
          type="password"
          required
          value={formik.values.password}
          name="password"
        />
      </label>
      {formik.errors.password ? (
        <div className={styles.required}>{formik.errors.password}</div>
      ) : null}
      <button className={styles.btnSubmit} type="submit">
        Submit
      </button>
    </form>
  );
};

export default SignupForm;
