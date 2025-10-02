// src/firebase/appointments.js
import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export const addAppointment = async (appointment) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), appointment);
    console.log('Appointment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding appointment:', error.code, error.message);
    throw new Error('Failed to add appointment. Please try again.');
  }
};

export const getAppointmentsByDate = async (dateString) => {
  // dateString example: "2025-10-01"
  try {
    const appointmentsCol = collection(db, 'appointments');
    const q = query(
      appointmentsCol,
      where('date', '==', dateString),
      orderBy('time', 'asc')
    );
    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error.code, error.message);
    throw new Error('Failed to load appointments.');
  }
};
