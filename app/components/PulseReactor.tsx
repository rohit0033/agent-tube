import React from 'react';
import styles from './PulseReactor.module.css';

const PulseReactor = () => {
  return (
    <div className={styles.reactorContainer}>
      <div className={styles.reactorRing}></div>
      <div className={styles.reactorCore}></div>
      <div className={styles.reactorGlow}></div>
    </div>
  );
};

export default PulseReactor;
