import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfileByUsername } from '../../api/profiles';
import styles from './Profile.module.css';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  // Query for the profile being viewed
  const { data: viewedProfile, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfileByUsername(username!),
    enabled: !!username,
  });

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/dashboard'); // Fallback to dashboard if no history
    }
  };

  if (isLoading) {
    return <div className={styles.container}>Loading profile...</div>;
  }

  if (error || !viewedProfile) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Profile Not Found</h2>
          <p>The profile you're looking for doesn't exist or has been removed.</p>
          <button 
            className={styles.backButton}
            onClick={handleBack}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          ← Back
        </button>

        <div className={styles.profileContent}>
          {viewedProfile.photo && (
            <img src={viewedProfile.photo} alt={viewedProfile.full_name} className={styles.photo} />
          )}
          <h1>{viewedProfile.full_name}</h1>
          
          {viewedProfile.bio && <p className={styles.bio}>{viewedProfile.bio}</p>}
          
          {viewedProfile.rating && (
            <div className={styles.rating}>
              Rating: {viewedProfile.rating.toFixed(1)} ⭐
            </div>
          )}
          
          {viewedProfile.instagram && (
            <a 
              href={`https://instagram.com/${viewedProfile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagram}
            >
              @{viewedProfile.instagram}
            </a>
          )}
          
          <div className={styles.joined}>
            Member since {formatDate(viewedProfile.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
} 