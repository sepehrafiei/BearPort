import React from 'react'
import { Link } from 'react-router'
import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.container} >
        <Link to="/login">Login</Link>
    </div>
  )
}

export default Home