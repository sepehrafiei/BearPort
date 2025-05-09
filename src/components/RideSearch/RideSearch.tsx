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

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    onSearch({
      origin: null,
      destination: null,
      startDate: null,
      endDate: null,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>From</label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Berkeley"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>To</label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. SFO"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Start Date</label>
        <input
          type="date"
          className={styles.input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>End Date</label>
        <input
          type="date"
          className={styles.input}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button 
        className={styles.clearButton} 
        onClick={handleClear}
      >
        Clear
      </button>
      <button 
        className={styles.searchButton} 
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
