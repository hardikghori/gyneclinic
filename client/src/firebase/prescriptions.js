// src/firebase/prescriptions.js
import { db } from './config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Add new prescription
export const addPrescription = async (prescription) => {
  try {
    const docRef = await addDoc(collection(db, 'prescriptions'), prescription);
    console.log('Prescription added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding prescription:', error.code, error.message);
    throw new Error('Failed to add prescription. Please try again.');
  }
};

// Fetch prescriptions by appointmentId
export const getPrescriptionsByAppointment = async (appointmentId) => {
  try {
    const prescriptionsCol = collection(db, 'prescriptions');
    const q = query(prescriptionsCol, where('appointmentId', '==', appointmentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching prescriptions:', error.code, error.message);
    throw new Error('Failed to load prescriptions.');
  }
};
