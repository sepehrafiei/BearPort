import React, { useState } from 'react';
import styles from './EditProfile.module.css';
import { ProfileType } from '../../types/index';
import { updateProfile, updateUsername } from '../../api/profiles';
import supabase from '../../helper/supabaseClient';
import imageCompression from 'browser-image-compression';
import {v4 as uuidv4} from 'uuid';

type EditProfileType = {
    profile: ProfileType;
    toggleDialog: () => void;
};

function EditProfile({ profile, toggleDialog }: EditProfileType) {
    const [bio, setBio] = useState(profile.bio || '');
    const [instagram, setInstagram] = useState(profile.instagram || '');
    const [username, setUsername] = useState(profile.username || '');
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateInstagram = (handle: string) => {
        // Remove @ if present
        const cleanHandle = handle.replace('@', '');
        // Instagram usernames can only contain letters, numbers, periods, and underscores
        const instagramRegex = /^[a-zA-Z0-9._]{1,30}$/;
        return instagramRegex.test(cleanHandle);
    };

    const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Remove @ if user types it
        const cleanValue = value.replace('@', '');
        setInstagram(cleanValue);
    };

    const uploadPhoto = async (file: File) => {
        try {
            const options = { maxSizeMB: 0.2, maxWidthOrHeight: 500, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { error } = await supabase.storage
                .from('profile-pics')
                .upload(fileName, compressedFile, { upsert: true });

            if (error) throw error;
            const { data: publicURL } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
            return publicURL.publicUrl;
        } catch (err) {
            console.error('Image upload error:', err);
            return null;
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            // Validate Instagram handle if provided
            if (instagram && !validateInstagram(instagram)) {
                setError('Invalid Instagram username. It can only contain letters, numbers, periods, and underscores.');
                setLoading(false);
                return;
            }

            let updatedPhotoUrl = profile.photo;

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

            if (username !== profile.username) {
                const { error: usernameError } = await updateUsername(username);
                if (usernameError) {
                    setError(usernameError.message);
                    setLoading(false);
                    return;
                }
            }

            const { error: profileError } = await updateProfile({ 
                bio, 
                instagram: instagram || null, // Store null if empty
                photo: updatedPhotoUrl 
            });

            if (profileError) {
                setError(profileError.message);
            } else {
                toggleDialog();
                window.location.reload();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.popup}>
                <div className={styles.head}>
                    <h1>Edit Profile</h1>
                    <button onClick={toggleDialog} className={styles.exit}>
                        ✕
                    </button>
                </div>
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
                        <p>Username</p>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                        />
                    </div>
                    <div className={styles.row}>
                        <p>Bio</p>
                        <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                        />
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
                        <input
                            type="text"
                            value={instagram}
                            onChange={handleInstagramChange}
                            placeholder="username"
                        />
                    </div>
                    <button className={styles.save} onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
