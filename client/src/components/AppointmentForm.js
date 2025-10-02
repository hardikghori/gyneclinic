// src/components/AppointmentForm.js
import React, { useState } from 'react';
import { addAppointment } from '../firebase/appointments';
import PatientAutocomplete from './PatientAutocomplete';

const AppointmentForm = ({ patientId }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [form, setForm] = useState({
    patientId: patientId || '',
    date: '',
    time: '',
    status: 'scheduled', // scheduled, canceled, completed
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId) {
      alert('Patient ID is required');
      return;
    }
    setLoading(true);
    try {
      await addAppointment(form);
      alert('Appointment added!');
      setSelectedPatient(null);
      setForm({
        patientId: '',
        date: '',
        time: '',
        status: 'scheduled',
        notes: '',
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 👇 Autocomplete that sets selectedPatient and also patientId in form */}
      {!patientId && (
        <>
          <PatientAutocomplete
            onSelect={(patient) => {
              setSelectedPatient(patient);
              setForm(prev => ({ ...prev, patientId: patient.id }));
            }}
          />
          {selectedPatient && (
            <p>Selected: {selectedPatient.name}</p>
          )}
        </>
      )}

      {/* Fallback manual input if autocomplete isn't used (e.g. direct patientId prop) */}
      {!patientId && form.patientId && (
        <p style={{ fontStyle: 'italic' }}>Patient ID: {form.patientId}</p>
      )}

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Appointment notes"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
