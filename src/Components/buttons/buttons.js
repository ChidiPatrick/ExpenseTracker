import React from 'react'
import styles from './buttons.module.scss'

export const Button = ({ children }) => {
  return <button className={styles.btnTransparent}>{children}</button>
}
// export default Buttons
