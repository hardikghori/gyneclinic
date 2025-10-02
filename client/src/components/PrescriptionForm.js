// src/components/PrescriptionForm.js
import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { db } from '../firebase/config';
import PatientAutocomplete from './PatientAutocomplete';

const PrescriptionForm = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', instructions: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', instructions: '' }]);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Prescription`, 105, 15, null, null, 'center');
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 25);
    doc.text(`Patient: ${selectedPatient?.name}`, 15, 35);
    doc.text(`Diagnosis: ${diagnosis}`, 15, 45);
    doc.text('Medications:', 15, 55);

    medications.forEach((med, i) => {
      doc.text(
        `${i + 1}. ${med.name} - ${med.dosage} - ${med.instructions}`,
        20,
        65 + i * 10
      );
    });

    doc.save(`Prescription_${selectedPatient?.name || 'patient'}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !diagnosis || medications.length === 0) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'prescriptions'), {
        patientId: selectedPatient.id,
        date: Timestamp.now(),
        diagnosis,
        medications
      });
      generatePDF();
      alert('Prescription saved and downloaded!');
      // Reset
      setDiagnosis('');
      setMedications([{ name: '', dosage: '', instructions: '' }]);
      setSelectedPatient(null);
    } catch (err) {
      alert('Error saving prescription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Prescription</h3>

      <PatientAutocomplete
        onSelect={(patient) => setSelectedPatient(patient)}
      />
      {selectedPatient && (
        <p>Selected: {selectedPatient.name}</p>
      )}

      <input
        type="text"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        required
      />

      {medications.map((med, idx) => (
        <div key={idx}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Dosage"
            value={med.dosage}
            onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Instructions"
            value={med.instructions}
            onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
            required
          />
        </div>
      ))}

      <button type="button" onClick={addMedication}>
        + Add Medication
      </button>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save & Download PDF'}
      </button>
    </form>
  );
};

export default PrescriptionForm;
