// src/components/FileUpload.js
import React from 'react';

const FileUpload = ({ patientId }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Upload Scan / Report</h4>
      <p style={{ fontStyle: 'italic', color: 'gray' }}>
        File upload is disabled to avoid storage costs. You can manually manage patient documents.
      </p>
    </div>
  );
};

export default FileUpload;
