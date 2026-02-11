import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const RegistrationsReport = () => {
  const [regs, setRegs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/registrations');
        setRegs(res.data);
        const byUser = await api.get('/reports/registrations/by-user');
        setUsers(byUser.data.users || []);
      } catch (err) {
        console.error(err);
        alert('Failed to load registrations report');
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Registrations Report</h2>
      <h3>Registrations By User</h3>
      {users.length === 0 ? (
        <p>No per-user registration data.</p>
      ) : (
        <div>
          {users.map((u) => (
            <div key={u.membershipNumber} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              <strong>{u.member?.memberName || u.membershipNumber}</strong> — {u.count} registration(s)
              <ul>
                {u.events.map((ev, idx) => (
                  <li key={idx}>{ev.eventName || 'Unknown event'} — {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : ''} ({ev.status || 'registered'})</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Event</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {regs.map((r) => (
            <tr key={r._id}>
              <td>{r.username || r.user || r.membershipNumber}</td>
              <td>{r.eventId?.eventName || r.eventName}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
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

export default RegistrationsReport;
