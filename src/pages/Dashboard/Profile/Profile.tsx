import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../../api/fetchProfile';
import styles from './Profile.module.css'

const Profile = () => {
  const { status, error, data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error')
    return <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>;

  return (
    <div>
      {profile ? (
        <div className={styles.container}>
          <img className={styles.pfp} src={profile.profile_pic}/>
          <p>Name: {profile.full_name}</p>
          <p>Email: {profile.email}</p>
          <p>Bio: {profile.bio}</p>
        </div>
      ) : (
        <p>Profile not found.</p>
      )}
    </div>
  );
};

export default Profile;
