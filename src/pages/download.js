import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { saveAs } from 'file-saver';
import { FaDownload } from "react-icons/fa6";
import Head from 'next/head';
import PlaceAttributes from "../../public/data/PlaceAttributes.json"
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
    DataValue: "hydrometeorological_disasters",
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

]

const DataDownloadPage = () => {
  const [selectedDataQuery, setSelectedDataQuery] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [districtList, setDistrictList] = useState([]);
  const [talukaList, setTalukaList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [filteredData, setFilteredData] = useState(null);


  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);




  useEffect(() => {
    if (selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/monsoonData?type=${"Tehsil"}`);
          const jsonData = await response.json();
          setSelectedData(jsonData);
        } catch (error) {
          console.error('Error loading the data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedDataQuery]);

  useEffect(() => {
    if (selectedVariable && selectedDataQuery && selectedDataQuery.DataValue === "hydrometeorological_disasters") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/hydrometeorologicalData?type=${selectedVariable.value}`);
          const jsonData = await response.json();
          setSelectedData(jsonData);
        } catch (error) {
          console.error('Error loading the data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedVariable, selectedDataQuery]);









  const handleStateSelect = (event, value) => {
    let items = selectedData && selectedData.filter((item) => item.STATE === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();

    setDistrictList(items);
    setSelectedState(value)
    setFilteredData(items)




  };

  const handleDistrictSelect = (event, value) => {

    let items = selectedData && selectedData.filter((item) => item.DISTRICT === value && item.STATE === selectedState);
    items = [...new Set(items.map((item) => item))];
    items.sort();

    setTalukaList(items);
    setSelectedDistrict(value)
    setFilteredData(items)

  };

  const handleTalukaSelect = (event, value) => {

    let items = selectedData && selectedData.filter((item) => item.TEHSIL === value && item.DISTRICT === selectedDistrict);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setSelectedTehsil(value)
    setFilteredData(items)

  };


  // const jsonToCSV = (json) => {
  //   const csvRows = [];
  //   const headers = Object.keys(json[0]);
  //   csvRows.push(headers.join(','));

  //   for (const row of json) {
  //     const values = headers.map(header => {
  //       const escaped = ('' + row[header]).replace(/"/g, '\\"');
  //       return `"${escaped}"`;
  //     });
  //     csvRows.push(values.join(','));
  //   }
  //   return csvRows.join('\n');
  // };


  const jsonToCSV = (json) => {
    // Filter out only the necessary columns based on selectedVariable.value
    console.log(json)
    const selectedColumns = json.map(item => ({
      ID: item.ID,
      STATE: item.STATE,
      DISTRICT: item.DISTRICT,
      TEHSIL: item.TEHSIL,
      [selectedVariable.value]: item[selectedVariable.value]
    }));

    // Prepare CSV rows
    const csvRows = [];
    const headers = Object.keys(selectedColumns[0]);
    csvRows.push(headers.join(','));

    for (const row of selectedColumns) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };



  // Function to handle the download
  const handleDownload = () => {
    const csvData = jsonToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  };



  return (
    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Download data</title>
      </Head>

      <PageHeading
      title="Download data"
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

            {selectedData && selectedData.length > 0 && selectedData[0].STATE && (
              <div className='col-md-6'>
                <label>Select State</label>
                <select
                  className="form-select mb-3"
                  onChange={(event) => handleStateSelect(event, event.target.value)}
                  disabled={!selectedVariable}
                >
                  <option defaultValue>Select State</option>

                  {
                    [...new Set(PlaceAttributes.map(item => item.STATE))].sort().map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                </select>
              </div>

            )}

            {selectedData && selectedData.length > 0 && selectedData[0].DISTRICT && (
              <div className='col-md-6'>
                <label >Select District</label>
                <select
                  className="form-select mb-3"
                  onChange={(event) => handleDistrictSelect(event, event.target.value)}
                  disabled={districtList.length === 0}
                >
                  <option defaultValue>Select District</option>

                  {districtList.length > 0 &&
                    [...new Set(districtList.map(item => item.DISTRICT))].sort().map((district, index) => (
                      <option key={index} value={district}>{district}</option>
                    ))}
                </select>
              </div>

            )}


            {selectedData && selectedData.length > 0 && selectedData[0].TEHSIL && (
              <div className='col-md-6'>
                <label>Select Tehsil</label>
                <select
                  className="form-select mb-3"
                  onChange={(event) => handleTalukaSelect(event, event.target.value)}
                  disabled={talukaList.length === 0}
                >
                  <option defaultValue>Select Tehsil</option>

                  {talukaList.length > 0 &&
                    [...new Set(talukaList.map(item => item.TEHSIL))].sort().map((taluka, index) => (
                      <option key={index} value={taluka}>{taluka}</option>
                    ))}
                </select>
              </div>

            )}










            <div className='col-md-6'>

              <button
                className="btn btn-primary mb-3 mt-4"
                style={{ width: "100%" }}
                onClick={handleDownload}
                disabled={!filteredData || filteredData.length === 0}
              >
                Download <FaDownload />
              </button>
            </div>




          </div>






        </div>

      </div>
      <Footer />
    </>
  )
}

export default DataDownloadPage
