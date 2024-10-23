import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { saveAs } from 'file-saver';
import { FaDownload } from "react-icons/fa6";
import Head from 'next/head';
import PageHeading from '@/components/pageHeading';
const MapDatasetOptions = [
  {
    DataName: "Monsoon variability",
    DataValue: "MonsoonData",
    AdminBoundary: ["Tehsil", "District", "State"],
    variables: [

      {
        name: "Changes in June rainfall",
        value: "june_panomaly_mean",
      },
      {
        name: "Changes in July rainfally",
        value: "july_panomaly_mean",
      },
      {
        name: "Changes in  August rainfall",
        value: "august_panomaly_mean",
      },
      {
        name: "Changes in September rainfall",
        value: "september_panomaly_mean",
      },
      {
        name: "Changes in total JJAS rainfall",
        value: "jjas_percent_anomaly_mean",
      },
      {
        name: "Changes in October rainfall",
        value: "october_panomaly_mean",
      },
      {
        name: "Changes in November rainfall",
        value: "november_panomaly_mean",
      },
      {
        name: "Changes in December rainfall",
        value: "december_panomaly_mean",
      },
      {
        name: "Changes in total OND rainfall",
        value: "ond_panomaly_mean",
      },
    ]
  },

  {
    DataName: "Hydrometeorological disasters",
    DataValue: "HydrometeorologicalData",
    AdminBoundary: ["District"],
    variables: [

      {
        name: "Flood pentad",
        value: "flood_pentad_occurrence",

      },
      {
        name: "Drought pentad",
        value: "drought_pentad_occurrence",

      },
      {
        name: "Cyclone pentad",
        value: "cyclone_pentad_occurrence",

      },

    ]
  },
  {
    DataName: "Temperature variability",
    DataValue: "TemperatureVariability",
    AdminBoundary: ["District"],
    variables: [

      {
        name: "Extreme warm nights",
        value: "Extreme_warm_nights",

      },
      {
        name: "Extreme hot days",
        value: "Extreme_hot_days",

      },

    ]
  },
  {
    DataName: "Climate risk and adaptation",
    DataValue: "ClimateRiskAdaptationData",
    AdminBoundary: ["District"],
    variables: [

      {
        name: "Agriculture",
        value: "Agriculture",

      },
      {
        name: "Water",
        value: "Water",

      },

    ]
  },

]

const DataDownloadPage = () => {
  const [selectedDataQuery, setSelectedDataQuery] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedAdminUnit, setSelectedAdminUnit] = useState(null);

  // const [filteredData, setFilteredData] = useState(null);


  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);



  // Function to handle the download
  const handleDownload = async () => {
    if (selectedDataQuery && selectedVariable && selectedAdminUnit) {
      setLoading(true);
      try {
        const response = await fetch(`/api/download?data=${selectedDataQuery.DataValue}&selectedVariable=${selectedVariable.value}&type=${selectedAdminUnit}`);
        const jsonData = await response.json();

        // Convert JSON data to CSV
        const csvData = jsonToCSV(jsonData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${selectedDataQuery.DataValue}.csv`);
      } catch (error) {
        console.error('Error downloading the data:', error);
      } finally {
        setLoading(false);
      }
    }
  };





  const jsonToCSV = (jsonData) => {
    const csvRows = [];
  
    // Get the headers from the first object in the data
    const headers = Object.keys(jsonData[0]);
    csvRows.push(headers.join(',')); // Add the headers row
  
    // Loop through the data and format each row
    for (const row of jsonData) {
      const values = headers.map(header => {
        // Handle 0 explicitly, make sure it doesn't get dropped
        const value = row[header] === 0 ? 0 : (row[header] || ''); 
        const escapedValue = String(value).replace(/"/g, '\\"'); // Escape quotes
        return `"${escapedValue}"`; // Wrap value in quotes for CSV format
      });
      csvRows.push(values.join(',')); // Add each row to CSV
    }
  
    return csvRows.join('\n'); // Return the CSV as a string
  };
  





  return (
    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Data Download | CRAI</title>
      </Head>

      <PageHeading
        title="Data download"
      />


      <div className='page_container'>



        <div className='card_container'>
          <div className='row'>
            <div className='col-md-6'>
              <label>Select Dataset</label>
              <select className="form-select mb-3" onChange={(e) => {
                const selectedDataValue = e.target.value;
                const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                setSelectedDataQuery(selectedData);
                setSelectedData(null);
                setSelectedAdminUnit(null)
                setSelectedVariable(null)

              }}>
                <option defaultValue>Select Data</option>
                {MapDatasetOptions.map((item, index) => (
                  <option key={index} value={item.DataValue}>{item.DataName}</option>
                ))}
              </select>
            </div>

            <div className='col-md-6'>

              <label>Select Variable</label>
              <select
                className="form-select mb-3"
                onChange={(event) => {
                  const selectedOptionValue = event.target.value;
                  const selectedOption = selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
                  setSelectedVariable(selectedOption);
                  setSelectedAdminUnit(null)
                }}
                disabled={!selectedDataQuery}
              >
                <option defaultValue>Select Variable</option>
                {selectedDataQuery && selectedDataQuery.variables.map((variable, index) => (
                  <option key={index} value={variable.value}>
                    {variable.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-6'>

              <label>Admin Level</label>
              <select
              value={selectedAdminUnit || ''}
                className="form-select mb-3"
                onChange={(event) => {
                  setSelectedAdminUnit(event.target.value);
                }}
                disabled={!selectedVariable}
              >
                <option value={null}>Select Admin Unit</option>
                {selectedDataQuery && selectedDataQuery.AdminBoundary.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>








            <div className='col-md-6'>

            <button
                className="data_download_btn mb-3 mt-4"
                style={{ width: "100%" }}
                onClick={handleDownload}
                disabled={!selectedVariable || !selectedAdminUnit}
              >
                {loading ? 'Loading...' : 'Download CSV'} <FaDownload />
              </button>
            </div>




          </div>






        </div>


        {/* {loading && (
          <div className='map_layer_loader_container_desktop' style={{ width: "80vw" }}>
            <div className="map_loader_container">
              <span className="map_loader"></span>
            </div>

          </div>

        )} */}

      </div>
      <Footer />
    </>
  )
}

export default DataDownloadPage
