import React from 'react';
import styles from './ProfilePopup.module.css';

interface Profile {
  id: string;
  name: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  rating?: number;
  total_rides?: number;
  member_since?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
}

const ProfilePopup: React.FC<Props> = ({ isOpen, onClose, profile }) => {
  if (!isOpen || !profile) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <div className={styles.profileHeader}>
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h3>{profile.name}</h3>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Rating</span>
              <span className={styles.value}>{profile.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Total Rides</span>
              <span className={styles.value}>{profile.total_rides || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>
                {profile.member_since ? new Date(profile.member_since).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <h4>Contact Information</h4>
            {profile.email && (
              <div className={styles.contactItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className={styles.contactItem}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{profile.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup; 