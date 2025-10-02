// src/firebase/storage.js
import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file, folder = 'uploads') => {
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  try {
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('File upload error:', error.code, error.message);
    throw new Error('Upload failed. Please check your internet connection and file.');
  }
};
