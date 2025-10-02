// src/App.js
import React, { useState } from 'react';
import PatientAutocomplete from './components/PatientAutocomplete';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import PatientRecords from './components/PatientDetail';
import PrescriptionForm from './components/PrescriptionForm';
import FollowUpChecklist from './components/FollowUpChecklist';

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedAppointment(null);
    setShowAppointmentForm(false);
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(false);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleAppointmentSaved = () => {
    setShowAppointmentForm(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gyne Clinic</h1>

      {/* Patient Search */}
      <section style={styles.section}>
        <h2 style={styles.subheading}>Step 1: Select Patient</h2>
        <PatientAutocomplete onSelect={handlePatientSelect} />
      </section>

      {/* Content for selected patient */}
      {selectedPatient && (
        <section style={styles.section}>
          <h2 style={styles.subheading}>Patient: {selectedPatient.name}</h2>

          {/* Step 2: Appointment List */}
          {!showAppointmentForm && !selectedAppointment && (
            <>
              <div style={styles.section}>
                <h3>Appointments</h3>
                <AppointmentList
                  patientId={selectedPatient.id}
                  onSelect={handleAppointmentSelect}
                  selectedAppointmentId={selectedAppointment?.id}
                />
                <button onClick={handleAddAppointment} style={styles.button}>
                  + Add Appointment
                </button>
              </div>

              {/* Step 3: Patient Records */}
              <div style={styles.section}>
                <h3>Patient Medical Record</h3>
                <PatientRecords patientId={selectedPatient.id} />
              </div>
            </>
          )}

          {/* Step 4: Appointment Form */}
          {showAppointmentForm && (
            <div style={styles.section}>
              <h3>{selectedAppointment ? 'Edit' : 'New'} Appointment</h3>
              <AppointmentForm
                patientId={selectedPatient.id}
                appointment={selectedAppointment}
                onSaved={handleAppointmentSaved}
                onCancel={() => setShowAppointmentForm(false)}
              />
            </div>
          )}

          {/* Step 5: Prescription and Follow-Ups */}
          {selectedAppointment && !showAppointmentForm && (
            <>
              <div style={styles.section}>
                <h3>Prescription</h3>
                <PrescriptionForm appointmentId={selectedAppointment.id} />
              </div>

              <div style={styles.section}>
                <h3>Follow-Up Checklist</h3>
                <FollowUpChecklist patientId={selectedPatient.id} />
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginTop: 30,
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    background: '#f9f9f9',
  },
  subheading: {
    marginBottom: 10,
    color: '#444',
  },
  button: {
    marginTop: 10,
    padding: '8px 16px',
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default App;
