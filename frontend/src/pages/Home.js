import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pdf/files');
        setPdfFiles(res.data.files);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('pdf', event.target.elements.pdf.files[0]);

    try {
      const uploadRes = await axios.post('http://localhost:5000/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadRes.data.success) {
        setSuccessMessage('File uploaded successfully!');
        setErrorMessage('');

        const res = await axios.get('http://localhost:5000/api/pdf/files');
        setPdfFiles(res.data.files);
      } else {
        setSuccessMessage('');
        setErrorMessage('File upload failed.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setSuccessMessage('');
      setErrorMessage('File upload failed.');
    }
  };

  const handleViewPdf = (pdfUrl) => {
    navigate('/view-pdf', { state: { pdfUrl } });
  };

  const handleDeletePdf = async (pdfId) => {
    try {
      const deleteRes = await axios.delete(`http://localhost:5000/api/pdf/${pdfId}`);
      if (deleteRes.data.success) {
        setSuccessMessage('File deleted successfully!');
        setErrorMessage('');
        const updatedFiles = pdfFiles.filter(file => file._id !== pdfId);
        setPdfFiles(updatedFiles);
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to delete file.');
      }
    } catch (err) {
      console.error('File deletion error:', err);
      setSuccessMessage('');
      setErrorMessage('Failed to delete file.');
    }
  };

  const handleLogout = () => {
   
    navigate('/login');
  };

  return (
    <div className="home-container">
           <h1>Upload Your Document...</h1>
      <div className="upload-form">
         <form onSubmit={handleFileUpload}>
          <input type="file" name="pdf" accept="application/pdf" required />
          <button type="submit">Upload</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="uploaded-pdfs">
        <h2>Uploaded Files</h2>
        <div className="pdf-list">
          {pdfFiles.map((file, index) => (
            <div key={file._id} className="pdf-item">
              <span>{file.name}</span>
              <div className="pdf-buttons">
              <button onClick={() => handleViewPdf(file.name)} className="view-pdf-button">
                  View
                </button>
                <button onClick={() => handleDeletePdf(file._id)} className="delete-pdf-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Home;
