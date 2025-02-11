import React from "react"
import styles from "./Home.module.css"
import Login from "../../components/Login/Login"
import Logo from "../../assets/Logo.png"
import Spacer from "../../components/Spacer/Spacer"

export default function Home() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
      <Spacer/>
      <div className={styles.left}>
        <img className={styles.logo} src={Logo} alt="" />
        <h1 className={styles.logo_text}>BEARPORT</h1>
      </div>
      <Spacer/>
      <Login/>
      <Spacer/>
      
    </div>
    <footer>Free Service by a Fellow Bear, Tired of Paying for Ubers! </footer>
    </div>
    
  )
}

