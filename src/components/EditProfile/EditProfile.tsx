import React from 'react'
import styles from './EditProfile.module.css'
import {ProfileType} from '../../types/index'

type EditProfileType = {
    profile: ProfileType;
}

function EditProfile({profile}:EditProfileType) {
  return (
    <div className={styles.container}>
        <h1>Edit profile</h1>
        <p>Make change to your profile. Click save when you're done.</p>
        <div className={styles.inputContainer}>
            <div className={styles.name}>
                <h2>Name: </h2>
                <input type="text" disabled value={profile.full_name}/>
            </div>
            <div className={styles.email}>
                <h2>Email: </h2>
                <input type="text" disabled value={profile.email}/>
            </div>
            <div className={styles.email}>
                <h2>Bio: </h2>
                <input type="text"  value={profile.bio}/>
            </div>
            <div className={styles.email}>
                <h2>pfp: </h2>
                <input type="file"/>
            </div>
        </div>
    </div>
  )
}

export default EditProfile