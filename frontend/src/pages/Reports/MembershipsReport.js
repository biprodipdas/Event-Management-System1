import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const MembershipsReport = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/memberships');
        setMembers(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load memberships report');
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Memberships Report</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.type}</td>
              <td>{m.status}</td>
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

export default MembershipsReport;
