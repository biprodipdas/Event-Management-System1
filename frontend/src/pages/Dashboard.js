import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/reports/dashboard');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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
          <span style={styles.username}>Welcome, {user?.username} ({user?.role})</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Dashboard</h1>

        <div style={styles.menuSection}>
          <h3 style={styles.sectionTitle}>Quick Access</h3>
          <div style={styles.menuGrid}>
            {isAdmin() && (
              <div style={styles.menuCard}>
                <h4 style={styles.menuCardTitle}>Maintenance</h4>
                <p style={styles.menuCardDesc}>Manage memberships and events (Admin Only)</p>
                <div style={styles.linkGroup}>
                  <Link to="/maintenance/add-membership" style={styles.menuLink}>Add Membership</Link>
                  <Link to="/maintenance/update-membership" style={styles.menuLink}>Update Membership</Link>
                  <Link to="/maintenance/add-event" style={styles.menuLink}>Add Event</Link>
                  <Link to="/maintenance/update-event" style={styles.menuLink}>Update Event</Link>
                </div>
              </div>
            )}

            <div style={styles.menuCard}>
              <h4 style={styles.menuCardTitle}>Transactions</h4>
              <p style={styles.menuCardDesc}>Event registrations and bookings</p>
              <div style={styles.linkGroup}>
                <Link to="/transactions/register-event" style={styles.menuLink}>Register for Event</Link>
                <Link to="/transactions/cancel-registration" style={styles.menuLink}>Cancel Registration</Link>
              </div>
            </div>

            <div style={styles.menuCard}>
              <h4 style={styles.menuCardTitle}>Reports</h4>
              <p style={styles.menuCardDesc}>View reports and analytics</p>
              <div style={styles.linkGroup}>
                <Link to="/reports/memberships" style={styles.menuLink}>Membership Report</Link>
                <Link to="/reports/events" style={styles.menuLink}>Events Report</Link>
                <Link to="/reports/registrations" style={styles.menuLink}>Registration Report</Link>
              </div>
            </div>
          </div>
        </div>

        {!loading && stats && (
          <div style={styles.statsSection}>
            <h3 style={styles.sectionTitle}>Statistics</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.stats.totalMemberships}</div>
                <div style={styles.statLabel}>Total Memberships</div>
                <div style={styles.statSubtext}>{stats.stats.activeMemberships} active</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.stats.totalEvents}</div>
                <div style={styles.statLabel}>Total Events</div>
                <div style={styles.statSubtext}>{stats.stats.upcomingEvents} upcoming</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.stats.totalRegistrations}</div>
                <div style={styles.statLabel}>Total Registrations</div>
                <div style={styles.statSubtext}>{stats.stats.activeRegistrations} active</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.chartLink}>
          <Link to="/flowchart" style={styles.link}>View Application Flow Chart</Link>
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
    gap: '20px'
  },
  username: {
    fontSize: '14px'
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
  pageTitle: {
    color: '#333',
    marginBottom: '30px'
  },
  menuSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  menuCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  menuCardTitle: {
    color: '#007bff',
    marginTop: 0,
    marginBottom: '10px'
  },
  menuCardDesc: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px'
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  menuLink: {
    color: '#007bff',
    textDecoration: 'none',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  statsSection: {
    marginBottom: '40px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '10px'
  },
  statLabel: {
    color: '#333',
    fontSize: '16px',
    marginBottom: '5px'
  },
  statSubtext: {
    color: '#666',
    fontSize: '14px'
  },
  chartLink: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '16px'
  }
};

export default Dashboard;
