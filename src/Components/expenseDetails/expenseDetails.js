import React from 'react'
import styles from './expenseDetails.module.scss'
const ExpenseDetails = () => {
  return (
    <div className={styles.expenseDetailsWrapper}>
      <div className={styles.navigator}>
        <div>X</div>
        <button>Done</button>
      </div>
      <div className={styles.expenseDetailsContainer}>
        <div className={styles.detailsLeft}>
          <div className={styles.date}>Date</div>
          <div className={styles.category}>Category</div>
          <div className={styles.amount}>Amount</div>
        </div>
        <div className={styles.detailsRight}>
          <div className={styles.currentDate}>01 Apr 2023</div>
          <input className={styles.inputElement} placeholder='Enter category' />
          <input className={styles.inputElement} placeholder='Amount' />
        </div>
        {/* <div className={styles.dateWrapper}>
          <div className={styles.date}>Date</div>
          <div className={styles.currentDate}>
            <div>01 Apr 2023</div>
          </div>
        </div>
        <div className={styles.categoryWrapper}>
          <div className={styles.category}>Category</div>
          <input className={styles.inputElement} placeholder='Enter category' />
        </div>
        <div className={styles.amountWrapper}>
          <div className={styles.amount}>Amount</div>
          <input className={styles.inputElement} placeholder='Amount' />
        </div> */}
      </div>
    </div>
  )
}
export default ExpenseDetails
