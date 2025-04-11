import { useState } from 'react';
import styles from './AddRoom.module.css';
import { addRide } from '../../api/rooms'; 
import { useQueryClient } from '@tanstack/react-query';
import { RideType } from '../../types';

function AddRoom({ toggleDialog }: { toggleDialog: () => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [when, setWhen] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  function convertToUTC(date: string, time: string, timezone: string): string {
    const localDateTime = new Date(`${date}T${time}`);
    return new Date(localDateTime.toLocaleString("en-US", { timeZone: timezone })).toISOString();
  }

  const handleSave = async () => {
    if (!from || !to || !when || !time || !capacity) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcTimestamp = convertToUTC(when, time, userTimeZone);

    try {
      const { data: newRide } = await addRide({
        origin: from,
        destination: to,
        departure_time: utcTimestamp,
        capacity,
      });

      queryClient.setQueryData(["rides"], (oldData: any) => {
        if (!oldData) return { pages: [[newRide]], pageParams: [] };
        return {
          ...oldData,
          pages: [[newRide, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      });

      toggleDialog();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Add Ride</h1>
        <button onClick={toggleDialog} className={styles.exit}>
          <img src="https://img.icons8.com/?size=100&id=82771&format=png&color=000000" alt="Close" />
        </button>
      </div>
      <p>Add a new Ride. Click save when you're done.</p>
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
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.valueAsNumber)} />
        </div>
        <button className={styles.save} onClick={handleSave} disabled={loading}>
          {loading ? 'Adding...' : 'Add Ride'}
        </button>
      </div>
    </div>
  );
}

export default AddRoom;
