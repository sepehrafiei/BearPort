import React from "react"
import styles from "./Home.module.css"
import Login from "../../components/Login/Login"
import Logo from "../../assets/Logo.png"
import Spacer from "../../components/Spacer/Spacer"

export default function Home() {
  return (
    <div className={styles.container}>
      <Spacer/>
      <img className={styles.logo} src={Logo} alt="" />
      <Spacer/>
      <Login/>
      <Spacer/>
      
    </div>
    
  )
}