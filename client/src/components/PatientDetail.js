import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import FollowUpChecklist from './FollowUpChecklist';

import FileUpload from './FileUpload';

const PatientDetail = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Patient info
        const patientRef = doc(db, 'patients', patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          setPatient(patientSnap.data());
        } else {
          setError('Patient not found');
          return;
        }

        // Appointments
        const apptQ = query(
          collection(db, 'appointments'),
          where('patientId', '==', patientId),
          orderBy('date', 'desc')
        );
        const apptSnap = await getDocs(apptQ);
        setAppointments(apptSnap.docs.map(doc => doc.data()));

        // Prescriptions
        const rxQ = query(
          collection(db, 'prescriptions'),
          where('patientId', '==', patientId)
        );
        const rxSnap = await getDocs(rxQ);
        setPrescriptions(rxSnap.docs.map(doc => doc.data()));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchDetails();
  }, [patientId]);

  if (!patientId) return <p>Select a patient to view details.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Phone:</strong> {patient.phone}</p>
      <p><strong>Obstetric History:</strong> {patient.obstetricHistory}</p>
      <p><strong>Menstrual Cycle:</strong> {patient.menstrualCycle}</p>

      <h3>Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        <ul>
          {appointments.map((appt, idx) => (
            <li key={idx}>
              {appt.date} @ {appt.time} - {appt.status} <br />
              <em>{appt.notes}</em>
            </li>
          ))}
        </ul>
      )}

      <h3>Prescriptions</h3>
      {prescriptions.length === 0 ? (
        <p>No prescriptions</p>
      ) : (
        <ul>
          {prescriptions.map((rx, idx) => (
            <li key={idx}>
              <strong>{rx.date?.toDate().toLocaleDateString()}</strong><br />
              <em>{rx.diagnosis}</em><br />
              {rx.medications.map((med, i) => (
                <div key={i}>
                  {med.name} - {med.dosage} - {med.instructions}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}

      <h3>Follow-Up Tasks</h3>
      <FollowUpChecklist patientId={patientId} />

      <FileUpload patientId={patientId} />
    </div>
    
  );
};

export default PatientDetail;
