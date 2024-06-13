import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "../css/Home.css";

const Home = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        if (!token) {
          throw new Error('No token found');
        }
    
        // Set up headers with the authorization token
        const headers = {
          Authorization: token
        };
    
        // Make the GET request to retrieve PDF files
        const res = await axios.get('http://localhost:5000/api/pdf/files', { headers });
        console.log("pdf files list", res.data.files)
        setPdfFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("pdf", event.target.elements.pdf.files[0]);

    try {
      const token = localStorage.getItem('token');
      const uploadRes = await axios.post(
        "http://localhost:5000/api/pdf/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             Authorization: token
          },
        }
      );
      console.log(uploadRes)
      if (uploadRes.data.success) {
        setSuccessMessage("File uploaded successfully!");
        setErrorMessage("");

        const res = await axios.get("http://localhost:5000/api/pdf/files");
        setPdfFiles(res.data.files);
      } else {
        setSuccessMessage("");
        setErrorMessage("File upload failed.");
      }
    } catch (err) {
      console.error("File upload error:", err);
      setSuccessMessage("");
      setErrorMessage("File upload failed.");
    }
  };

  const handleViewPdf = (pdfUrl) => {
    console.log("pdf url",pdfUrl)
    // const x = `localhost:5000/${pdfUrl}`
    // setCurrentPdfUrl(x);
    const externalUrl = `http://localhost:5000/${pdfUrl}`;
    window.location.href = externalUrl;
  };

  // const handleDeletePdf = async (pdfId) => {
  //   try {
  //   console.log("inside delete try")
  //     const deleteRes = await axios.post(
  //       `http://localhost:5000/api/pdf/delete/${pdfId}`
  //     );
  //     console.log("deleteRes.data",deleteRes.data)
  //     if (deleteRes.data.success) {
  //       console.log("inside delete if")
  //       setSuccessMessage("File deleted successfully!");
  //       setErrorMessage("");
  //       const updatedFiles = pdfFiles.filter((file) => file._id !== pdfId);
  //       setPdfFiles(updatedFiles);
  //     } else {
  //       console.log("inside else in delete route")
  //       setSuccessMessage("");
  //       setErrorMessage("Failed to delete file.");
  //     }
  //   } catch (err) {
  //     console.error("File deletion error: IN CATCH", err);
  //     setSuccessMessage("");
  //     setErrorMessage("Failed to delete file.");
  //   }
  // };
  const handleDeletePDF = async (pdfId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/pdf/delete/${pdfId}`);
      console.log("response.data",response.data)
      if (response.data.success) {
        console.log('File deleted successfully');

        setSuccessMessage("File deleted successfully!");
              setErrorMessage("");
              const updatedFiles = pdfFiles.filter((file) => file._id !== pdfId);
              setPdfFiles(updatedFiles);
      } else {
        console.error('Failed to delete file:', response.data.error);
      }
    } catch (error) {
      console.error('Error in deleting PDF:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>Upload Your Document...</h1>
      <div className="upload-form">
        <form onSubmit={handleFileUpload}>
          <input type="file" name="pdf" accept="application/pdf" required />
          <button type="submit">Upload</button>
        </form>
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="uploaded-pdfs">
        <h2>Uploaded Files</h2>
        <div className="pdf-list">
          {pdfFiles.map((file, index) => (
            <div key={file._id} className="pdf-item">
              <span>{file.name}</span>
              <div className="pdf-buttons">
                <button
                  onClick={() => handleViewPdf(file.path)}
                  className="view-pdf-button"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeletePDF(file._id)}
                  className="delete-pdf-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {currentPdfUrl && (
        <div className="pdf-viewer">
          <Document
            file={currentPdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Home;
