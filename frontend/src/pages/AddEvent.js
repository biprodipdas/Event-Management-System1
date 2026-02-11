import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddEvent = () => {
  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    capacity: '',
    description: '',
    eventType: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      await api.post('/events', payload);
      alert('Event created successfully');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Event Name</label>
        <input name="eventName" value={form.eventName} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Event Date</label>
        <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Venue</label>
        <input name="venue" value={form.venue} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Capacity</label>
        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Event Type</label>
        <input name="eventType" value={form.eventType} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} style={styles.textarea} required />

        <button type="submit" disabled={submitting} style={styles.button}>{submitting ? 'Saving...' : 'Create Event'}</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: 700,
    margin: '20px auto',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  label: { fontWeight: '600' },
  input: { padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  textarea: { padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 100 },
  button: { padding: '10px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }
};

export default AddEvent;
