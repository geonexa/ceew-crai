import React, { useRef, useState } from 'react'
import IndiaTehsils from '../../public/data/shapefiles/IndiaTehsils.json';
import PlaceAttributes from "../../public/data/PlaceAttributes.json"
import Papa from 'papaparse';
import dynamic from 'next/dynamic';
import MapLoader from '@/components/MapLoader';
import Head from 'next/head';
import { useAlertContext } from '@/context/AlertContext';
import cyclone_legend from "../../public/images/cyclone_legend.jpg"
import flood_legend from "../../public/images/flood_legend.jpg"
import drought_legend from "../../public/images/drought_legend.jpg"

const DecesionSupportMap = dynamic(() => import('../components/DecesionSupportMap'), {
    ssr: false,
    loading: () =>  <MapLoader/>
});


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
    // {
    //   DataName: "Hydrometeorological disasters",
    //   DataValue: "hydrometeorological_disasters",
    //   AdminBoundary: ["District"],
    //   variables: [
  
    //     {
    //       name: "Flood pentad",
    //       value: "flood_pentad_occurrence",
    //       legendTitel:"Frequency of flood",
    //       legendImg:flood_legend,
    //     },
    //     {
    //       name: "Drought pentad",
    //       value: "drought_pentad_occurrence",
    //       legendTitel:"Frequency of drought",
    //       legendImg:drought_legend,
    //     },
    //     {
    //       name: "Cyclone pentad",
    //       value: "cyclone_pentad_occurrence",
    //       legendTitel:"Frequency of cyclone",
    //       legendImg:cyclone_legend,
    //     },
  
    //   ]
    // },
  ]

const DecisionSupportPage = () => {

    const [selectedDataQuery, setSelectedDataQuery] = useState(null);
    const [selectedVariable1, setSelectedVariable1] = useState(null);
    const [selectedVariable2, setSelectedVariable2] = useState(null);
    const [selectedVariable3, setSelectedVariable3] = useState(null);
    const [selectedVariable4, setSelectedVariable4] = useState(null);

    const [districtList, setDistrictList] = useState([]);
    const [talukaList, setTalukaList] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTehsil, setSelectedTehsil] = useState(null);
    const [filteredIndiaDistrict, setFilteredIndiaDistrict] = useState(null);
    const [uploadeddata, setUploadeddata] = useState([]);

    const { setAlertMessage, setShowAlert } = useAlertContext();
    const fileInputRef = useRef(null);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            setShowAlert(true);
            setAlertMessage("Please select a file.");
            return;
        }

        const fileType = selectedFile.name.split('.').pop();

        if (fileType === "csv") {
            Papa.parse(selectedFile, {
                header: true,
                complete: function (results) {
                    const uploadedHeaders = Object.keys(results.data[0]);
                    const requiredHeaders = ["Latitude", "Longitude", "ID"];

                    const missingHeaders = requiredHeaders.filter(header => !uploadedHeaders.includes(header));

                    if (missingHeaders.length > 0) {
                        setShowAlert(true);
                        setAlertMessage(`The following headers are missing in the selected CSV file: ${missingHeaders.join(", ")}`);
                        return;
                    }
                    setUploadeddata(results.data);
                },
                error: function (error) {
                    setShowAlert(true);
                    setAlertMessage("Error parsing CSV file: " + error.message);
                }
            });
        } else if (fileType === "geojson") {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    setUploadeddata(jsonData);
                } catch (error) {
                    setShowAlert(true);
                    setAlertMessage("Error reading GeoJSON file: " + error.message);
                }
            };
            reader.onerror = function () {
                setShowAlert(true);
                setAlertMessage("Error loading the file");
            };
            reader.readAsText(selectedFile);
        } else {
            setShowAlert(true);
            setAlertMessage("Unsupported file type. Please upload a CSV or GeoJSON file.");
        }
    };



    const handleStateSelect = (event, value) => {
        let items = PlaceAttributes.filter((item) => item.STATE === value);
        items = [...new Set(items.map((item) => item))];
        items.sort();

        setDistrictList(items);
        setSelectedState(value)

        let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.STATE === value);

        setFilteredIndiaDistrict({
            type: "FeatureCollection",
            features: filteredFeatures,
        });

    };

    const handleDistrictSelect = (event, value) => {

        let items = PlaceAttributes.filter((item) => item.DISTRICT === value && item.STATE === selectedState);
        items = [...new Set(items.map((item) => item))];
        items.sort();

        setTalukaList(items);
        setSelectedDistrict(value)

        let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.DISTRICT === value && feature.properties.STATE === selectedState);

        setFilteredIndiaDistrict({
            type: "FeatureCollection",
            features: filteredFeatures,
        });

    };

    const handleTalukaSelect = (event, value) => {

        let items = PlaceAttributes.filter((item) => item.TEHSIL === value && item.DISTRICT === selectedDistrict);
        items = [...new Set(items.map((item) => item))];
        items.sort();
        setSelectedTehsil(value)
        let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.TEHSIL === value && feature.properties.DISTRICT === selectedDistrict);

        setFilteredIndiaDistrict({
            type: "FeatureCollection",
            features: filteredFeatures,
        });


    };

    const handleCancelSelection = () => {
        setUploadeddata([]); // Reset the uploaded data state
        if (fileInputRef.current) {
            fileInputRef.current.value = null;  // Correctly reset the input
        }

    };






    return (
        <>
        <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Decision support</title>
      </Head>

            <div className='dasboard_page_container'>


                <div className='main_dashboard'>
                    <div className='left_panel'>

                        <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>

                            <div className="accordion" >
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Select data
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                                        <div className="accordion-body">
                                            <div className='map_layers'>

                                                <label>Select Dataset</label>
                                                <select className="form-select mb-3" onChange={(e) => {
                                                    const selectedDataValue = e.target.value;
                                                    const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                                                    setSelectedDataQuery(selectedData);
                                                }}>
                                                    <option defaultValue>Select</option>
                                                    {MapDatasetOptions.map((item, index) => (
                                                        <option key={index} value={item.DataValue}>{item.DataName}</option>
                                                    ))}
                                                </select>


                                            </div>

                                        </div>


                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-heading2">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse2" aria-expanded="true" aria-controls="panelsStayOpen-collapse2">
                                            Select variable
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapse2" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading2">

                                        <div className="accordion-body">
                                            <div className='map_layers'>



                                                <label>Select Map-1 Variable</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable1(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery}
                                                >
                                                    <option selected>Select Variable</option>
                                                    {selectedDataQuery && selectedDataQuery.variables.map((variable, index) => (
                                                        <option key={index} value={variable.value}>
                                                            {variable.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <label>Select Map-2 Variable</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable2(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery}
                                                >
                                                    <option selected>Select Variable</option>
                                                    {selectedDataQuery && selectedDataQuery.variables.map((variable, index) => (
                                                        <option key={index} value={variable.value}>
                                                            {variable.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <label>Select Map-3 Variable</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable3(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery}
                                                >
                                                    <option selected>Select Variable</option>
                                                    {selectedDataQuery && selectedDataQuery.variables.map((variable, index) => (
                                                        <option key={index} value={variable.value}>
                                                            {variable.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <label>Select Map-4 Variable</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable4(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery}
                                                >
                                                    <option selected>Select Variable</option>
                                                    {selectedDataQuery && selectedDataQuery.variables.map((variable, index) => (
                                                        <option key={index} value={variable.value}>
                                                            {variable.name}
                                                        </option>
                                                    ))}
                                                </select>





                                            </div>

                                        </div>



                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-heading3">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse3" aria-expanded="true" aria-controls="panelsStayOpen-collapse3">
                                            Select administrative units
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapse3" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading3">

                                        <div className="accordion-body">
                                            <div className='map_layers'>

                                                <label>Select State</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => handleStateSelect(event, event.target.value)}
                                                    disabled={!selectedVariable1}
                                                >
                                                    <option selected>Select State</option>

                                                    {PlaceAttributes &&
                                                        [...new Set(PlaceAttributes.map(item => item.STATE))].sort().map((state, index) => (
                                                            <option key={index} value={state}>{state}</option>
                                                        ))}
                                                </select>

                                                <label >Select District</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => handleDistrictSelect(event, event.target.value)}
                                                    disabled={districtList.length === 0}
                                                >
                                                    <option selected>Select District</option>

                                                    {districtList.length > 0 &&
                                                        [...new Set(districtList.map(item => item.DISTRICT))].sort().map((district, index) => (
                                                            <option key={index} value={district}>{district}</option>
                                                        ))}
                                                </select>

                                                <label>Select Tehsil</label>
                                                <select
                                                    class="form-select mb-3"
                                                    onChange={(event) => handleTalukaSelect(event, event.target.value)}
                                                    disabled={talukaList.length === 0}
                                                >
                                                    <option selected>Select Tehsil</option>

                                                    {talukaList.length > 0 &&
                                                        [...new Set(talukaList.map(item => item.TEHSIL))].sort().map((taluka, index) => (
                                                            <option key={index} value={taluka}>{taluka}</option>
                                                        ))}
                                                </select>



                                            </div>

                                        </div>



                                    </div>
                                </div>



                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                        <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="frue" aria-controls="panelsStayOpen-collapseTwo">
                                            Upload Data
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                                        <div className="accordion-body">
                                            <div>
                                                <label className="form-label">Upload point data in .csv or polygon data in .geojson format</label>
                                                <input
                                                    className="form-control form-control-sm"
                                                    type="file" accept=".csv,.geojson"
                                                    onChange={handleFileChange}
                                                    title='Only .csv or .geojson files are accepted'
                                                    ref={fileInputRef}
                                                />

                                                <button
                                                    className="btn btn-secondary mt-2"
                                                    onClick={handleCancelSelection}
                                                    disabled={!uploadeddata || uploadeddata.length === 0}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>


                        </div>


                    </div>

                    <div className='decision_maps_container'>

                        <div className='decision_maps'>
                            
                                <DecesionSupportMap
                                    selectedState={selectedState}
                                    selectedDistrict={selectedDistrict}
                                    selectedTehsil={selectedTehsil}
                                    selectedDataQuery={selectedDataQuery}
                                    filteredIndiaDistrict={filteredIndiaDistrict}
                                    selectedVariable={selectedVariable1}
                                    uploadeddata={uploadeddata}
                                    mapNumber="Map-1"
                                />
                        </div>

                        <div className='decision_maps'>
                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery}
                                filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable2}
                                uploadeddata={uploadeddata}
                                mapNumber="Map-2"
                            />
                        </div>

                        <div className='decision_maps'>
                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery}
                                filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable3}
                                uploadeddata={uploadeddata}
                                mapNumber="Map-3"
                            />
                        </div>

                        <div className='decision_maps'>

                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery}
                                filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable4}
                                uploadeddata={uploadeddata}
                                mapNumber="Map-4"
                            />
                        </div>


                    </div>

                </div>
            </div>

        </>
    )
}

export default DecisionSupportPage
