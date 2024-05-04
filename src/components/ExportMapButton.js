import React, { useState } from 'react'
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { AiFillPrinter } from 'react-icons/ai';

// import Logo from "../../public/images/logo-printpdf.jpg"
import { useAlertContext } from '@/context/AlertContext';


const ExportMapButton = ({ mapContainerRef, selectedYear, selectedSession }) => {

    const { setAlertMessage, setShowAlert } = useAlertContext();

    const handleExportMapPDF = () => {
        const mapContainer = mapContainerRef.current;
        const viewportWidth = window.innerWidth;


        // const logo = new Image();
        // logo.src = Logo;

        setAlertMessage('Map is downloading..')
        setShowAlert(true)


        const options = {
            width: mapContainer.offsetWidth * 2,
            height: mapContainer.offsetHeight * 2,
            style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
                width: '100%',
                height: 'auto',
            },
        };

        domtoimage
            .toBlob(mapContainer, options)
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const img = new Image();
                    img.onload = () => {
                        const aspectRatio = img.width / img.height;
                        const pdfOrientation = viewportWidth <= 767 ? 'portrait' : 'landscape';
                        const pdf = new jsPDF(pdfOrientation, 'px', 'a4');

                        // // 880, 500
                        // const logoWidth = 67.69; // Adjust the width of the logo as needed
                        // const logoHeight = 38.46
                        // // const logoX = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;

                        // const logoX = 10;
                        // const logoY = 6; // Adjust the Y-coordinate for the logo placement
                        // pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);



                        // Add title at the top
                        // const title = mapTitle;
                        // const titleFontSize = 16;
                        // const titleTextWidth = pdf.getStringUnitWidth(title) * titleFontSize / pdf.internal.scaleFactor;
                        // const titleTextX = (pdf.internal.pageSize.getWidth() - titleTextWidth) / 2;
                        // const titleTextY = 20; // Y-coordinate for the title

                        // pdf.setFontSize(titleFontSize);
                        // pdf.text(titleTextX, titleTextY, title);


                        if (viewportWidth <= 767) {
                            // Mobile legend size Width 400, height 100



                            const pdfHeight = pdf.internal.pageSize.getHeight() - 80; // Set the desired height for PDF if viewport width <= 767
                            const pdfWidth = pdfHeight * aspectRatio;
                            const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
                            const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
                            pdf.addImage(img, 'PNG', x, y, pdfWidth, pdfHeight);


                            // const LegendWidth = 133.33; // Adjust the width of the logo as needed
                            // const LegendHeight = 33.33;
                            // // const logoX = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
                            // const LegendX = pdf.internal.pageSize.getWidth() - pdfWidth + LegendWidth;
                            // const LegendY = pdf.internal.pageSize.getHeight() - LegendHeight - 80; 
                            // pdf.addImage(MobileLegend, 'PNG', LegendX, LegendY, LegendWidth, LegendHeight);


                            const websiteName = `Drought Condition of ${selectedSession} for year ${selectedYear}`;
                            const fontSize = 12;
                            const textWidth = pdf.getStringUnitWidth(websiteName) * fontSize / pdf.internal.scaleFactor;
                            const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2; // X-coordinate for center alignment
                            const textY = pdf.internal.pageSize.getHeight() - 25;

                            pdf.setFontSize(fontSize);
                            pdf.text(textX, textY, websiteName);


                        } else {
                            const pdfWidth = pdf.internal.pageSize.getWidth(); // Use A4 width for PDF if viewport width > 767
                            const pdfHeight = pdfWidth / aspectRatio;
                            const x = 0;
                            const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
                            pdf.addImage(img, 'PNG', x, y, pdfWidth, pdfHeight);
                        }

                        // Add text line at the bottom
                        const websiteName = 'This map has been downloaded from Climate resilience atlas for India';
                        const fontSize = 8;
                        const textWidth = pdf.getStringUnitWidth(websiteName) * fontSize / pdf.internal.scaleFactor;
                        const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2; // X-coordinate for center alignment
                        const textY = pdf.internal.pageSize.getHeight() - 10; // Y-coordinate for the text

                        pdf.setFontSize(fontSize);
                        pdf.text(textX, textY, websiteName);

                        const pdfOptions = {
                            compress: true, // Enable compression
                            quality: 0.4, // Adjust the quality (0.0 - 1.0, default is 0.9)
                        };

                        pdf.save('map.pdf', pdfOptions);

                        setAlertMessage('Map has been exported as PDF successfully!')
                        setShowAlert(true)

                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                setAlertMessage('Error exporting map image:', error)
                setShowAlert(true)

            });
    };

    return (
        <button onClick={handleExportMapPDF} className="map_print_btn">
            <AiFillPrinter />
        </button>


    )
}

export default ExportMapButton