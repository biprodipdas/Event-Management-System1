import React from 'react';

const UpdateEvent = () => {
  return (
    <div style={styles.container}>
      <h2>Update Event</h2>
      <p>This page will allow admins to update existing events. Coming soon.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: '20px auto',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  }
};

export default UpdateEvent;
