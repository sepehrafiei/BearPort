import { useState } from 'react';
import styles from './AddRoom.module.css';
import { createRoom } from '../../api/rooms'; 
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { RoomType } from '../../types/index';

function AddRoom({ toggleDialog }: { toggleDialog: () => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [when, setWhen] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient(); // React Query client

  const handleSave = async () => {
    
    setLoading(true);
    setError(null);

    const newRoom: Partial<RoomType> = {
      id: uuidv4(), // Temporary ID until backend returns a real one
      origin: from,
      destination: to,
      departure_time: time,
      departure_date: when,
      capacity,
      joined: true, // Since the creator is automatically a member
      count_members: 1, // Creator is the first member
    };

    // Optimistically update the UI with a temporary room
    queryClient.setQueryData(["rooms"], (oldData: any) => {
      if (!oldData) return { pages: [[newRoom]], pageParams: [] };

      return {
        ...oldData,
        pages: [[newRoom, ...oldData.pages[0]], ...oldData.pages.slice(1)], // Add new room to first page
      };
    });

    const { error } = await createRoom({
      origin: from,
      destination: to,
      departure_time: time,
      departure_date: when,
      capacity,
    });

    if (error) {
      setError(error.message);
      
    } else {
      toggleDialog();
       // Ensure the fetched rooms have the correct data
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
      <p>Add a new room. Click save when you're done.</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputContainer}>
        <div className={styles.row}>
          <p>From</p>
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className={styles.row}>
          <p>To</p>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
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
