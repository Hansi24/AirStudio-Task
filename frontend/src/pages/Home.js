import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "../css/Home.css";
import Swal from "sweetalert2";

const Home = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          throw new Error("No token found");
        }

        const headers = {
          Authorization: token,
        };

        const res = await axios.get("http://localhost:5000/api/pdf/files", {
          headers,
        });
        console.log("pdf files list", res.data.files);
        setPdfFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [reload]);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.elements.pdf.files[0];
    console.log("file size", file.size);
    // Check file size (max 15MB)
    const maxSize = 10 * 1024 * 1024; // 15MB in bytes
    if (file.size > maxSize) {
      console.log("File size is more than 10MB");
      Swal.fire({
        title: "Error",
        text: "File size should be less than 10MB",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      const formData = new FormData();
      formData.append("pdf", file);
      const token = localStorage.getItem("token");
      const uploadRes = await axios.post(
        "http://localhost:5000/api/pdf/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      console.log(uploadRes.data.success);
      if (uploadRes.data.success) {
        Swal.fire({
          title: "Success",
          text: "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          setReload(!reload);
          document.getElementById("pdf-input").value = "";
          setSuccessMessage("");
          setErrorMessage("");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to upload file",
          icon: "error",
          confirmButtonText: "Ok",
        }).then(() => {
          setReload(!reload);
          document.getElementById("pdf-input").value = "";
          setSuccessMessage("");
          setErrorMessage("");
        });
      }
    }
  };

  const handleViewPdf = (pdfUrl) => {
    console.log("pdf url", pdfUrl);
    const externalUrl = `http://localhost:5000/${pdfUrl}`;
    window.open(externalUrl, "_blank");
  };

  const handleDeletePDF = async (pdfId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = localStorage.getItem("token");
          const headers = {
            Authorization: token,
          };
          console.log(headers);
          const response = await axios.post(
            `http://localhost:5000/api/pdf/delete/${pdfId}`,
            pdfId,
            { headers }
          );
          console.log("response.data", response.data);
          if (response.data.success) {
            console.log("File deleted successfully");

            const updatedFiles = pdfFiles.filter((file) => file._id !== pdfId);
            setPdfFiles(updatedFiles);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            setReload(!reload);
          } else {
            console.error("Failed to delete file:", response.data.error);
            Swal.fire("Error", "Failed to delete file", "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your file is safe :)", "error");
        }
      });
    } catch (error) {
      console.error("Error in deleting PDF:", error.message);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logged out successfully",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      localStorage.clear();
      navigate("/login");
    });
  };

  return (
    <div className="home-container">
      <h1>Upload Your Documents...</h1>
      <div className="upload-form">
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            name="pdf"
            id="pdf-input"
            accept="application/pdf"
            required
          />
          <button type="submit" className="upload-btn">Upload</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="uploaded-pdfs">
        <h2>Uploaded Files</h2>
        <div className="pdf-list">
          {pdfFiles.map((file) => (
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
