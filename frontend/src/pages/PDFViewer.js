import React from 'react';
import { useLocation } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = () => {
    const location = useLocation();
    const { pdfUrl } = location.state;

    return (
        <div className="pdf-viewer">
           
        </div>
    );
};

export default PDFViewer;
