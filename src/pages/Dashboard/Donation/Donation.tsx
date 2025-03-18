import React from 'react'
import venmo from '../../../assets/venmo.jpg'
import styles from './Donation.module.css'

function Donation() {
  return (
    <div className={styles.container}>
      <img className={styles.qrCode} src={venmo} alt="" />
    </div>
  )
}

export default Donation