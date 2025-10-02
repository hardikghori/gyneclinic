// src/firebase/firestore.js
import { db } from './config';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

// Add a new patient
export const addPatient = async (patient) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patient);
    console.log('Patient added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding patient:', error.code, error.message);
    throw new Error('Failed to add patient. Please try again.');
  }
};

// Fetch all patients
export const getAllPatients = async () => {
  try {
    const patientsCol = collection(db, 'patients');
    const snapshot = await getDocs(patientsCol);
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error.code, error.message);
    throw new Error('Failed to load patients.');
  }
};

