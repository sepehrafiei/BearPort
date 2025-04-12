import { useState } from "react";
import styles from './RideSearch.module.css'

interface RideSearchProps {
  onSearch: (filters: {
    origin: string | null;
    destination: string | null;
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

export default function RideSearch({ onSearch }: RideSearchProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch({
      origin: origin.trim() || null,
      destination: destination.trim() || null,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Origin: </label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Berkeley"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Destination: </label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. SFO"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Start Date: </label>
        <input
          type="date"
          className={styles.input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>End Date: </label>
        <input
          type="date"
          className={styles.input}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
