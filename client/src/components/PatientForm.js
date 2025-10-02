import React, { useState } from 'react';
import { addPatient } from '../firebase/patients';

const PatientForm = ({ onPatientAdded }) => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    phone: '',
    email: '',
    obstetricHistory: '',
    menstrualCycle: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPatientId = await addPatient(form);
      alert('Patient added successfully!');
      if (onPatientAdded) onPatientAdded(newPatientId);
      setForm({
        name: '',
        dob: '',
        phone: '',
        email: '',
        obstetricHistory: '',
        menstrualCycle: '',
        notes: '',
      });
    } catch (error) {
      alert(error.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="obstetricHistory" value={form.obstetricHistory} onChange={handleChange} placeholder="Obstetric History" />
      <input name="menstrualCycle" value={form.menstrualCycle} onChange={handleChange} placeholder="Menstrual Cycle" />
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Patient'}</button>
    </form>
  );
};

export default PatientForm;

