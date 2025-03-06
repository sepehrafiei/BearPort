import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../../api/fetchProfile';
import styles from './Profile.module.css'
import { useRef } from 'react';
import EditProfile from '../../../components/EditProfile/EditProfile'
import {ProfileType} from '../../../types/index'

const Profile = () => {
  const { status, error, data: profile } = useQuery<ProfileType>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if(!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open") 
    ? dialogRef.current.close()
    : dialogRef.current.showModal();
  }

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error')
    return <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>;

  return (
    <div>
      {profile ? (
        <div className={styles.container}>
          <img className={styles.pfp} src={profile.profile_pic}/>
          <p className={styles.name}>{profile.full_name}</p>
          <p>Email: {profile.email}</p>
          {profile.bio? (<p>Bio: {profile.bio}</p>) : null}
          <button onClick={()=> {
            toggleDialog();
          }}>Edit</button>
        </div>
      ) : (
        <p>Profile not found.</p>
      )}
      <dialog ref={dialogRef}><EditProfile profile={profile} toggleDialog={toggleDialog}/></dialog>
    </div>
  );
};

export default Profile;
