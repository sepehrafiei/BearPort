import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MembersPopup.module.css';

interface Member {
  id: string;
  name: string;
  photo_url?: string;
  is_host: boolean;
  username: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
}

const MembersPopup: React.FC<Props> = ({ isOpen, onClose, members }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleMemberClick = (username: string) => {
    navigate(`/profile/${username}`);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Group Members</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.membersList}>
          {members.map(member => (
            <div 
              key={member.id} 
              className={styles.memberRow}
              onClick={() => handleMemberClick(member.username)}
            >
              <div className={styles.memberInfo}>
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.memberDetails}>
                  <span className={styles.name}>{member.name}</span>
                  {member.is_host && <span className={styles.hostBadge}>Host</span>}
                </div>
              </div>
              <button className={styles.viewProfileButton}>View Profile</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersPopup; 