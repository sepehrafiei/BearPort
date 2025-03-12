import { useState } from 'react';
import styles from './AddRoom.module.css';
import { RoomType } from '../../types/index';
import { createRoom } from '../../api/rooms'; // Function to update profile data
import {v4 as uuidv4} from 'uuid';



function AddRoom({toggleDialog} : {toggleDialog: () => void}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [when, setWhen] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
      setLoading(true);
      setError(null);

      const { error } = await createRoom({ origin: from, destination: to, departure_time: time, departure_date: when, capacity});
  
      if (error) {
        setError(error.message);
      } else {
        toggleDialog();
        window.location.reload();
      }
  
      setLoading(false);
    };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Add Room</h1>
        <button onClick={toggleDialog} className={styles.exit}>
          <img src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000" alt="Close" />
        </button>
      </div>
      <p>Make changes to your profile. Click save when you're done.</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputContainer}>
        <div className={styles.row}>
          <p>From</p>
          <input type="text"  value={from} onChange={(e) => setFrom(e.target.value)}/>
        </div>
        <div className={styles.row}>
          <p>To</p>
          <input type="text"  value={to} onChange={(e) => setTo(e.target.value)}/>
        </div>
        <div className={styles.row}>
          <p>Date</p>
          <input type="date" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div className={styles.row}>
          <p>Time</p>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className={styles.row}>
          <p>Capacity</p>
          <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.valueAsNumber)} />
        </div>
        <button className={styles.save} onClick={handleSave} disabled={loading}>
          {loading ? 'Adding...' : 'Add Room'}
        </button>
        
      </div>
    </div>
  );
}

export default AddRoom;
