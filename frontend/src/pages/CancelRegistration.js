import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const CancelRegistration = () => {
  const [regs, setRegs] = useState([]);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const res = await api.get('/registrations');
        setRegs(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load registrations');
      }
    };
    fetchRegs();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      setRegs((prev) => prev.filter((r) => r._id !== id));
      alert('Cancelled');
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Registrations</h2>
      {regs.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        <ul style={styles.list}>
          {regs.map((r) => (
            <li key={r._id} style={styles.item}>
              <div>{r.eventName} - {new Date(r.eventDate).toLocaleDateString()}</div>
              <button onClick={() => handleCancel(r._id)} style={styles.btn}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 800, margin: '20px auto', backgroundColor: 'white', borderRadius: 8 },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' },
  btn: { padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4 }
};

export default CancelRegistration;
