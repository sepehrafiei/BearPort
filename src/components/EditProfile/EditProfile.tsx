import { useState } from 'react';
import styles from './EditProfile.module.css';
import { ProfileType } from '../../types/index';
import { updateProfile } from '../../api/profiles'; // Function to update profile data
import supabase from '../../helper/supabaseClient'; // Supabase client
import imageCompression from 'browser-image-compression'; // For compressing images
import {v4 as uuidv4} from 'uuid';

type EditProfileType = {
  profile: ProfileType;
  toggleDialog: () => void;
};

function EditProfile({ profile, toggleDialog }: EditProfileType) {
  const [bio, setBio] = useState(profile.bio || '');
  const [instagram, setInstagram] = useState(profile.instagram || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to compress and upload the image
  const uploadPhoto = async (file: File) => {
    try {
      // Compress the image
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 500, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-pics')
        .upload(fileName, compressedFile, { upsert: true });

      if (error) throw error;

      // Get public URL of the uploaded file
      const { data: publicURL } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
      return publicURL.publicUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      return null;
    }
  };

  // Handle profile update
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    let updatedPhotoUrl = profile.photo; // Keep old photo unless new one is uploaded

    if (photo) {
      const uploadedUrl = await uploadPhoto(photo);
      if (uploadedUrl) {
        updatedPhotoUrl = uploadedUrl;
      } else {
        setError('Failed to upload photo');
        setLoading(false);
        return;
      }
    }

    const { error } = await updateProfile({ bio, instagram, photo: updatedPhotoUrl});

    if (error) {
      setError(error.message);
    } else {
      toggleDialog(); // Close modal on success
      window.location.reload(); // Refresh to reflect changes
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Edit Profile</h1>
        <button onClick={toggleDialog} className={styles.exit}>
          <img src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000" alt="Close" />
        </button>
      </div>
      <p>Make changes to your profile. Click save when you're done.</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputContainer}>
        <div className={styles.row}>
          <p>Name</p>
          <input type="text" disabled value={profile.full_name} />
        </div>
        <div className={styles.row}>
          <p>Email</p>
          <input type="text" disabled value={profile.email} />
        </div>
        <div className={styles.row}>
          <p>Bio</p>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className={styles.row}>
          <p>Photo</p>
          <input
            className={styles.file}
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </div>
        <div className={styles.row}>
          <p>Instagram</p>
          <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <button className={styles.save} onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        
      </div>
    </div>
  );
}

export default EditProfile;
