// src/components/PatientAutocomplete.js
import React, { useState, useEffect } from 'react';
import { getAllPatients, addPatient } from '../firebase/patients';

const PatientAutocomplete = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', phone: '' });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }
      const patients = await getAllPatients();
      const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    };
    fetchSuggestions();
  }, [input]);

  const handleAddNew = () => {
    setShowForm(true);
    setNewPatient({ name: input, age: '', phone: '' });
  };

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    try {
      const saved = await addPatient(newPatient);
      alert('Patient added!');
      onSelect({ ...newPatient, id: saved.id });
      setShowForm(false);
      setInput('');
    } catch (err) {
      alert('Error adding patient: ' + err.message);
    }
  };

  if (showForm) {
    return (
      <form onSubmit={handleSubmitNew} style={{ marginBottom: 20 }}>
        <h4>Add New Patient</h4>
        <input
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
      </form>
    );
  }

  return (
    <div>
      <input
        placeholder="Search or add patient..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {suggestions.map((p) => (
            <li key={p.id} onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
              {p.name}
            </li>
          ))}
          {suggestions.length === 0 && (
            <li onClick={handleAddNew} style={{ cursor: 'pointer', color: 'green' }}>
              + Add new patient: "{input}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default PatientAutocomplete;
