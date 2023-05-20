import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import styles from "./signUp.module.scss";
import { auth } from "../Firebase";
import { useNavigate } from "react-router";
const ResetPassword = () => {
  const [showMessage, setShowMessage] = useState(false);
  let emailRef = useRef();
  let passwordRef = useRef();
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/");
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
      console.log("Submitted!");
      emailRef.current.value = "";
      passwordRef.current.value = "";
      setShowMessage(true);

      //   sendPasswordResetEmail(auth, values.email);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className={styles.userForm}>
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
          ref={emailRef}
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
          ref={passwordRef}
        />
      </label>
      {formik.errors.password ? (
        <div className={styles.required}>{formik.errors.password}</div>
      ) : null}
      <div className={styles.btnWrapper}>
        <input type="submit" value="Reset" className={styles.btnSubmit} />
        <button onClick={handleCancel} className={styles.btnSubmit}>
          Cancle
        </button>
      </div>
      <div className={showMessage ? styles.feedbackMessage : styles.hidden}>
        <p>Please Check your email for the reset</p>
      </div>
    </form>
  );
};

export default ResetPassword;
