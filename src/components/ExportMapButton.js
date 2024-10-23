import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AiFillPrinter } from 'react-icons/ai';
import { useAlertContext } from '@/context/AlertContext';

const ExportMapButton = ({ mapContainerRef, selectedYear, selectedSession }) => {
    const { setAlertMessage, setShowAlert } = useAlertContext();

    const handleExportMapPDF = () => {
        const mapContainer = mapContainerRef.current;
        const viewportWidth = window.innerWidth;

        setAlertMessage('Map is downloading...');
        setShowAlert(true);

        html2canvas(mapContainer, {
            scale: 2, // Increase scale for better quality
            useCORS: true // Ensure cross-origin images are handled
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const aspectRatio = canvas.width / canvas.height;
            const pdfOrientation = viewportWidth <= 767 ? 'portrait' : 'landscape';
            const pdf = new jsPDF(pdfOrientation, 'px', 'a4');

            if (viewportWidth <= 767) {
                const pdfHeight = pdf.internal.pageSize.getHeight() - 80;
                const pdfWidth = pdfHeight * aspectRatio;
                const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
                const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);

                const websiteName = `Drought Condition of ${selectedSession} for year ${selectedYear}`;
                const fontSize = 12;
                const textWidth = pdf.getStringUnitWidth(websiteName) * fontSize / pdf.internal.scaleFactor;
                const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
                const textY = pdf.internal.pageSize.getHeight() - 25;

                pdf.setFontSize(fontSize);
                pdf.text(textX, textY, websiteName);
            } else {
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdfWidth / aspectRatio;
                const x = 0;
                const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
            }

            // Add text line at the bottom
            // const websiteName = 'This map has been downloaded from Climate resilience atlas for India';
            // const fontSize = 8;
            // const textWidth = pdf.getStringUnitWidth(websiteName) * fontSize / pdf.internal.scaleFactor;
            // const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
            // const textY = pdf.internal.pageSize.getHeight() - 10;

            // pdf.setFontSize(fontSize);
            // pdf.text(textX, textY, websiteName);

            pdf.save('map.pdf');

            setAlertMessage('Map has been exported as PDF successfully!');
            setShowAlert(true);
        }).catch((error) => {
            console.error('Error exporting map:', error);
            setAlertMessage(`Error exporting map: ${error.message}`);
            setShowAlert(true);
        });
    };

    return (
        <button onClick={handleExportMapPDF} className="map_print_btn">
            <AiFillPrinter />
        </button>
    );
};

export default ExportMapButton;
