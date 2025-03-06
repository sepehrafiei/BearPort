import React from 'react'
import styles from './EditProfile.module.css'
import {ProfileType} from '../../types/index'

type EditProfileType = {
    profile: ProfileType;
    toggleDialog: () => void;
}

function EditProfile({profile, toggleDialog}:EditProfileType) {
  return (
    <div className={styles.container}>
        <div className={styles.head}>
            <h1>Edit profile</h1>
            <button onClick={toggleDialog} className={styles.exit}><img src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000" alt="" /></button>
        </div>
        <p>Make change to your profile. Click save when you're done.</p>
        <div className={styles.inputContainer}>
            <div className={styles.row}>
                <p>Name </p>
                <input type="text" disabled value={profile.full_name}/>
            </div>
            <div className={styles.row}>
                <p>Email </p>
                <input type="text" disabled value={profile.email}/>
            </div>
            <div className={styles.row}>
                <p>Bio </p>
                <input type="text"  />
            </div>
            <div className={styles.row}>
                <p>Profile Photo </p>
                <input type="file"/>
            </div>
            <div className={styles.row}>
                <p>Instagram </p>
                <input type="text"/>
            </div>
            <button>Save Changes</button>
        </div>
    </div>
  )
}

export default EditProfile