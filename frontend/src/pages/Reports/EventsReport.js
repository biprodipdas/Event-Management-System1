import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const EventsReport = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load events report');
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Events Report</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Capacity</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.eventName}</td>
              <td>{new Date(e.eventDate).toLocaleDateString()}</td>
              <td>{e.venue}</td>
              <td>{e.capacity}</td>
              <td>{e.eventType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 1000, margin: '20px auto', backgroundColor: 'white', borderRadius: 8 },
  table: { width: '100%', borderCollapse: 'collapse' }
};

export default EventsReport;
