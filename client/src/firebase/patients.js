import { db } from './config';
import { collection, addDoc, getDocs } from 'firebase/firestore';


export const addPatient = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patientData);
    return docRef.id; // Return the newly created patient ID
  } catch (error) {
    console.error('Error adding patient:', error.code, error.message);
    throw new Error('Failed to add patient');
  }
};

export const getAllPatients = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'patients'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};
