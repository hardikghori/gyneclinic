// src/components/AppointmentList.js
import React, { useState, useEffect } from 'react';
import { getAppointmentsByDate } from '../firebase/appointments';

const AppointmentList = ({ patientId, onSelect, selectedAppointmentId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointmentsByDate(patientId);
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    } else {
      setAppointments([]);
    }
  }, [patientId]);

  if (!patientId) return <p>Please select a patient to see appointments.</p>;
  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Appointments</h3>
      {appointments.length === 0 && <p>No appointments found.</p>}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {appointments.map((appt) => (
          <li
            key={appt.id}
            onClick={() => onSelect(appt)}
            style={{
              cursor: 'pointer',
              padding: '8px 12px',
              margin: '4px 0',
              backgroundColor: appt.id === selectedAppointmentId ? '#d1e7dd' : '#f8f9fa',
              borderRadius: 4,
              border: '1px solid #ced4da',
            }}
          >
            <strong>{new Date(appt.datetime).toLocaleString()}</strong> — {appt.status}
            {appt.notes && <div style={{ fontSize: 12, color: '#555' }}>{appt.notes}</div>}
          </li>
        ))}
      </ul>
      <button onClick={fetchAppointments} style={{ marginTop: 10 }}>
        Refresh
      </button>
    </div>
  );
};

export default AppointmentList;
