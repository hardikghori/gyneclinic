// src/firebase/followups.js
import { db } from './config';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

export const addFollowUp = async (followUp) => {
  try {
    const docRef = await addDoc(collection(db, 'followups'), followUp);
    console.log('Follow-up added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding follow-up:', error.code, error.message);
    throw new Error('Failed to add follow-up.');
  }
};

export const getFollowUpsByPatient = async (patientId) => {
  try {
    const q = query(collection(db, 'followups'), where('patientId', '==', patientId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching follow-ups:', error.code, error.message);
    throw new Error('Failed to load follow-ups.');
  }
};

export const toggleFollowUpDone = async (id, done) => {
  try {
    const docRef = doc(db, 'followups', id);
    await updateDoc(docRef, { done });
  } catch (error) {
    console.error('Error updating follow-up:', error.code, error.message);
    throw new Error('Failed to update follow-up.');
  }
};
