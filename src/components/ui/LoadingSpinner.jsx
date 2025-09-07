import React from 'react';
import styles from './Global.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
