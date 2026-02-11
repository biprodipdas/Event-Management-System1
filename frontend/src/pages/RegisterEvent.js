import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const RegisterEvent = () => {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load events');
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async () => {
    setError('');
    if (!selected) return setError('Select an event');
    if (!membershipNumber) return setError('Enter your membership number');
    setLoading(true);
    try {
      // verify membership exists
      try {
        await api.get(`/memberships/${membershipNumber}`);
      } catch (verifyErr) {
        if (verifyErr.response?.status === 404) {
          setError('Membership not found');
          return;
        }
        console.error('Membership verify error:', verifyErr);
        setError('Failed to verify membership');
        return;
      }

      await api.post('/registrations', { eventId: selected, membershipNumber });
      alert('Registered successfully');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register for Event</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <div style={styles.form}>
        <label style={{ marginBottom: 6 }}>Membership Number</label>
        <input value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value)} placeholder="Enter your membership number (e.g. MEM000001)" style={{ padding: 8, marginBottom: 10, width: '100%' }} />

        <select value={selected} onChange={(e) => setSelected(e.target.value)} style={styles.select}>
          <option value="">-- Select event --</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>{ev.eventName} ({new Date(ev.eventDate).toLocaleDateString()})</option>
          ))}
        </select>
        <button onClick={handleRegister} style={styles.button} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 700, margin: '20px auto', backgroundColor: 'white', borderRadius: 8 },
  form: { display: 'flex', gap: 10, alignItems: 'center' },
  select: { flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }
};

export default RegisterEvent;
