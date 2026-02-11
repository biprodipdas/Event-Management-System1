import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Flowchart = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {user && (
        <nav style={styles.nav}>
          <h2 style={styles.navTitle}>Event Management System</h2>
          <div style={styles.navRight}>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </nav>
      )}

      <div style={styles.content}>
        <h1 style={styles.title}>Application Flow Chart</h1>
        
        <div style={styles.flowchart}>
          <div style={styles.flowSection}>
            <h3 style={styles.sectionTitle}>Authentication Flow</h3>
            <div style={styles.flowBox}>Login/Register → Dashboard</div>
          </div>

          <div style={styles.flowSection}>
            <h3 style={styles.sectionTitle}>Admin Access (Maintenance Module)</h3>
            <div style={styles.flowPath}>
              <div style={styles.flowBox}>Dashboard</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowBox}>Maintenance Menu</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowGroup}>
                <div style={styles.flowBox}>Add Membership</div>
                <div style={styles.flowBox}>Update Membership</div>
                <div style={styles.flowBox}>Add Event</div>
                <div style={styles.flowBox}>Update Event</div>
              </div>
            </div>
          </div>

          <div style={styles.flowSection}>
            <h3 style={styles.sectionTitle}>User & Admin Access (Transactions)</h3>
            <div style={styles.flowPath}>
              <div style={styles.flowBox}>Dashboard</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowBox}>Transactions Menu</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowGroup}>
                <div style={styles.flowBox}>Register for Event</div>
                <div style={styles.flowBox}>Cancel Registration</div>
              </div>
            </div>
          </div>

          <div style={styles.flowSection}>
            <h3 style={styles.sectionTitle}>User & Admin Access (Reports)</h3>
            <div style={styles.flowPath}>
              <div style={styles.flowBox}>Dashboard</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowBox}>Reports Menu</div>
              <div style={styles.arrow}>↓</div>
              <div style={styles.flowGroup}>
                <div style={styles.flowBox}>Membership Report</div>
                <div style={styles.flowBox}>Events Report</div>
                <div style={styles.flowBox}>Registration Report</div>
              </div>
            </div>
          </div>

          <div style={styles.noteSection}>
            <h3 style={styles.sectionTitle}>Important Notes</h3>
            <ul style={styles.noteList}>
              <li>Maintenance module is accessible only by Admin users</li>
              <li>All fields are mandatory in Add Membership form</li>
              <li>Default membership type is 6 months</li>
              <li>Membership number is required for Update Membership</li>
              <li>Users can extend or cancel memberships (Admin only)</li>
              <li>Session management is implemented for security</li>
              <li>Passwords are hidden during input</li>
              <li>Radio buttons allow only one selection</li>
              <li>Checkboxes indicate yes (checked) or no (unchecked)</li>
              <li>Form validations are in place</li>
            </ul>
          </div>
        </div>

        {!user && (
          <div style={styles.buttonGroup}>
            <Link to="/login" style={styles.button}>Go to Login</Link>
            <Link to="/register" style={styles.button}>Go to Register</Link>
          </div>
        )}
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '32px'
  },
  flowchart: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  flowSection: {
    marginBottom: '40px',
    paddingBottom: '30px',
    borderBottom: '2px solid #e0e0e0'
  },
  sectionTitle: {
    color: '#007bff',
    marginBottom: '20px'
  },
  flowPath: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  flowBox: {
    padding: '15px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    fontWeight: '500',
    textAlign: 'center',
    minWidth: '200px'
  },
  flowGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '10px'
  },
  arrow: {
    fontSize: '24px',
    color: '#007bff',
    fontWeight: 'bold'
  },
  noteSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffc107'
  },
  noteList: {
    marginLeft: '20px',
    color: '#333'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '30px'
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500'
  }
};

export default Flowchart;
