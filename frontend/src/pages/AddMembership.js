import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AddMembership = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberName: '',
    contactNumber: '',
    email: '',
    address: '',
    membershipType: '6months'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.memberName || !formData.contactNumber || !formData.email || !formData.address) {
      setError('All fields are mandatory');
      return;
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError('Contact number must be 10 digits');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await api.post('/memberships', formData);
      setSuccess(`Membership created successfully! Membership Number: ${response.data.membershipNumber}`);
      setFormData({
        memberName: '',
        contactNumber: '',
        email: '',
        address: '',
        membershipType: '6months'
      });
    } catch (error) {
      console.error('AddMembership error:', error);
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      setError(status ? `${status}: ${serverMessage}` : serverMessage);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={styles.navTitle}>Event Management System</h2>
        <div style={styles.navRight}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.title}>Add Membership</h2>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Member Name: *</label>
              <input
                type="text"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Number: *</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                style={styles.input}
                placeholder="10 digit number"
                maxLength="10"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email: *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Address: *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.textarea}
                rows="3"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Membership Type: *</label>
              <div>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membershipType"
                    value="6months"
                    checked={formData.membershipType === '6months'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  6 Months
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membershipType"
                    value="1year"
                    checked={formData.membershipType === '1year'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  1 Year
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membershipType"
                    value="2years"
                    checked={formData.membershipType === '2years'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  2 Years
                </label>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Add Membership</button>
              <button type="button" onClick={() => navigate('/dashboard')} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>

          <div style={styles.chartLink}>
            <Link to="/flowchart" style={styles.link}>View Application Flow Chart</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  nav: {
    backgroundColor: '#333',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitle: {
    margin: 0
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    borderRadius: '4px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#333',
    marginBottom: '25px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  radioLabel: {
    marginRight: '20px',
    color: '#333'
  },
  radio: {
    marginRight: '5px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  chartLink: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none'
  }
};

export default AddMembership;
