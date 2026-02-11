import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UpdateMembership = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membershipData, setMembershipData] = useState(null);
  const [extensionType, setExtensionType] = useState('6months');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMembership = async () => {
    if (!membershipNumber) {
      setError('Membership Number is mandatory');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/memberships/${membershipNumber}`);
      setMembershipData(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Membership not found');
      setMembershipData(null);
    }
    setLoading(false);
  };

  const handleExtend = async () => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/memberships/${membershipNumber}`, {
        action: 'extend',
        extensionType
      });
      setSuccess('Membership extended successfully!');
      fetchMembership();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to extend membership');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this membership?')) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      await api.put(`/memberships/${membershipNumber}`, {
        action: 'cancel'
      });
      setSuccess('Membership cancelled successfully!');
      fetchMembership();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel membership');
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
          <h2 style={styles.title}>Update Membership</h2>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <div style={styles.searchSection}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Membership Number: *</label>
              <div style={styles.searchRow}>
                <input
                  type="text"
                  value={membershipNumber}
                  onChange={(e) => setMembershipNumber(e.target.value)}
                  style={styles.input}
                  placeholder="Enter membership number"
                />
                <button onClick={fetchMembership} style={styles.searchBtn} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {membershipData && (
            <div style={styles.detailsSection}>
              <h3 style={styles.subtitle}>Membership Details</h3>
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <strong>Member Name:</strong> {membershipData.memberName}
                </div>
                <div style={styles.detailItem}>
                  <strong>Email:</strong> {membershipData.email}
                </div>
                <div style={styles.detailItem}>
                  <strong>Contact:</strong> {membershipData.contactNumber}
                </div>
                <div style={styles.detailItem}>
                  <strong>Address:</strong> {membershipData.address}
                </div>
                <div style={styles.detailItem}>
                  <strong>Membership Type:</strong> {membershipData.membershipType}
                </div>
                <div style={styles.detailItem}>
                  <strong>Status:</strong> 
                  <span style={{
                    ...styles.badge,
                    backgroundColor: membershipData.status === 'active' ? '#28a745' : 
                                   membershipData.status === 'expired' ? '#ffc107' : '#dc3545'
                  }}>
                    {membershipData.status}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <strong>Start Date:</strong> {new Date(membershipData.startDate).toLocaleDateString()}
                </div>
                <div style={styles.detailItem}>
                  <strong>End Date:</strong> {new Date(membershipData.endDate).toLocaleDateString()}
                </div>
              </div>

              {membershipData.status !== 'cancelled' && (
                <>
                  <h3 style={styles.subtitle}>Actions</h3>
                  
                  <div style={styles.actionSection}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Extend Membership:</label>
                      <div>
                        <label style={styles.radioLabel}>
                          <input
                            type="radio"
                            name="extensionType"
                            value="6months"
                            checked={extensionType === '6months'}
                            onChange={(e) => setExtensionType(e.target.value)}
                            style={styles.radio}
                          />
                          6 Months
                        </label>
                        <label style={styles.radioLabel}>
                          <input
                            type="radio"
                            name="extensionType"
                            value="1year"
                            checked={extensionType === '1year'}
                            onChange={(e) => setExtensionType(e.target.value)}
                            style={styles.radio}
                          />
                          1 Year
                        </label>
                        <label style={styles.radioLabel}>
                          <input
                            type="radio"
                            name="extensionType"
                            value="2years"
                            checked={extensionType === '2years'}
                            onChange={(e) => setExtensionType(e.target.value)}
                            style={styles.radio}
                          />
                          2 Years
                        </label>
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button onClick={handleExtend} style={styles.extendBtn}>
                        Extend Membership
                      </button>
                      <button onClick={handleCancel} style={styles.cancelMembershipBtn}>
                        Cancel Membership
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
              Back to Dashboard
            </button>
          </div>

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
    maxWidth: '900px',
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
  subtitle: {
    color: '#333',
    marginTop: '25px',
    marginBottom: '15px',
    fontSize: '18px'
  },
  searchSection: {
    marginBottom: '30px'
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
  searchRow: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  searchBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  detailsSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  detailItem: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px'
  },
  badge: {
    marginLeft: '10px',
    padding: '3px 8px',
    borderRadius: '3px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500'
  },
  actionSection: {
    marginTop: '20px'
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
    marginTop: '20px'
  },
  extendBtn: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  cancelMembershipBtn: {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  backBtn: {
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

export default UpdateMembership;
