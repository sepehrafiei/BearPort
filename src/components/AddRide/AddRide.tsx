import React, { useState } from 'react';
import styles from './AddRide.module.css';
import { addRide } from '../../api/rides';
import { RideType } from '../../types';

type AddRideType = {
    toggleDialog: () => void;
};

function AddRide({ toggleDialog }: AddRideType) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departure_time, setDepartureTime] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error: rideError } = await addRide({
                origin,
                destination,
                departure_time,
                capacity: parseInt(capacity)
            });

            if (rideError) {
                setError(rideError.message);
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
                    <h1>Add Ride</h1>
                    <button onClick={toggleDialog} className={styles.exit}>
                        <img className={styles.exit} src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000" alt="Close" />
                    </button>
                </div>
                <p>Add a new Ride. Click save when you're done.</p>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.inputContainer}>
                    <div className={styles.row}>
                        <p>From</p>
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Enter departure location"
                        />
                    </div>
                    <div className={styles.row}>
                        <p>To</p>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter destination"
                        />
                    </div>
                    <div className={styles.row}>
                        <p>Date and Time</p>
                        <input
                            type="datetime-local"
                            value={departure_time}
                            onChange={(e) => setDepartureTime(e.target.value)}
                        />
                    </div>
                    <div className={styles.row}>
                        <p>Capacity</p>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="Number of seats"
                            min="1"
                        />
                    </div>
                    <button className={styles.save} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Ride'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRide; 