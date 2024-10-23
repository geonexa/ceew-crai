import React, { Suspense, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic';
import Preloader from '../components/Preloader';
import MapLoader from '@/components/MapLoader';
import Head from 'next/head';
import { ColorLegendsData } from '../../public/data/ColorLegendsData';
import PlaceAttributes from "../../public/data/PlaceAttributes.json"
import { useAlertContext } from '@/context/AlertContext';
import Papa from 'papaparse';
import { MdDeleteForever } from "react-icons/md";



const VisualiseRiskChart = dynamic(() => import('@/components/charts/VisualiseRiskChart'), {
  ssr: false,
  loading: () => <MapLoader />
});

const VisualizeRiskMap = dynamic(() => import('@/components/maps/VisualizeRiskMap'), {
  ssr: false,
  loading: () => <MapLoader />

});



const ThematicLayersOptions = [
  {
    LayerName: "Solar Projects",
    value: "solar_projects",
    LayerData: "IndiaSolarProjects",
  },
  {
    LayerName: "Rivers",
    value: "river_network",
    LayerData: "IndiaRivers",
  },
]



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
      {
        name: "Change in frequency of heavy rainfall days",
        value: "jjas_heavy_anomaly_mean",
      },
      {
        name: "Change in frequency of very heavy rainfall days",
        value: "jjas_vheavy_anomaly_mean",

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
  {
    DataName: "Temperature variability",
    DataValue: "temperature_variability",
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
]


const RasterDataOptions = [
  {
    name: "Köppen-Geiger climatological zones",
    value: "climate_zones_map",
  },
]

const ClimateRiskPage = () => {
  const [selectedRasterLayer, setSelectedRasterLayer] = useState("");
  const [rasterLayerOpacity, setRasterLayerOpacity] = useState(1);
  const [selectedAdminBoundaries, setSelectedAdminBoundaries] = useState("");
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTimeseries, setShowTimeseries] = useState(false)
  const [selectedDataQuery, setSelectedDataQuery] = useState(null);
  const [colorLegendsDataItem, setColorLegendsDataItem] = useState(null);
  const { setAlertMessage, setShowAlert } = useAlertContext();
  const fileInputRef = useRef(null);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [uploadeddata, setUploadeddata] = useState([]);

  const [districtList, setDistrictList] = useState([]);
  const [talukaList, setTalukaList] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedThematicLayers, setSelectedThematicLayers] = useState([]);
  const [selectedAdminUnit, setSelectedAdminUnit] = useState(null)


  const mapContainerRef = useRef(null);
  const [selectedData, setSelectedData] = useState(null);
  const [geojsonJsonData, setGeojsonJsonData] = useState(null);



  useEffect(() => {
    if (selectedAdminBoundaries !== "" && selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && selectedVariable && selectedVariable.value) {
      const fetchData = async () => {
        try {
          setLoading(true);

          const queryString = new URLSearchParams({
            selectedVariable: selectedVariable.value,
            type: selectedAdminBoundaries,
          }).toString();

          // const response = await fetch(`/api/monsoonData?type=${selectedAdminBoundaries}`);
          const response = await fetch(`/api/monsoonData?${queryString}`);
          const geojsonresponse = await import(`../../public/data/Admin_Boundary/India${selectedAdminBoundaries}s.json`);
          setGeojsonJsonData(geojsonresponse.default);
          setSelectedAdminUnit(geojsonresponse.default)
          setColorLegendsDataItem(ColorLegendsData[selectedVariable.value])

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
  }, [selectedAdminBoundaries, selectedDataQuery, selectedVariable]);


  useEffect(() => {
    if (selectedAdminBoundaries && selectedVariable && selectedDataQuery && selectedDataQuery.DataValue === "hydrometeorological_disasters") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/hydrometeorologicalData?type=${selectedVariable.value}`);
          const geojsonresponse = await import(`../../public/data/Admin_Boundary/India${selectedAdminBoundaries}s.json`);
          setGeojsonJsonData(geojsonresponse.default);
          setSelectedAdminUnit(geojsonresponse.default)
          setColorLegendsDataItem(ColorLegendsData[`${selectedVariable.value}`])
          

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
  }, [selectedVariable, selectedDataQuery, selectedAdminBoundaries]);

  useEffect(() => {
    if (selectedAdminBoundaries && selectedVariable && selectedDataQuery && selectedDataQuery.DataValue === "temperature_variability") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/temperatureVariability`);
          const geojsonresponse = await import(`../../public/data/Admin_Boundary/India${selectedAdminBoundaries}s.json`);
          setGeojsonJsonData(geojsonresponse.default);
          setSelectedAdminUnit(geojsonresponse.default)
          setColorLegendsDataItem(ColorLegendsData[`${selectedVariable.value}`])


          const jsonData = await response.json();

          // const textResponse = await response.text();  
        // console.log('Response from API:', textResponse);
        
          setSelectedData(jsonData);

          // console.log(response)
          // console.log("jsonData",jsonData)
        } catch (error) {
          console.error('Error loading the data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedVariable, selectedDataQuery, selectedAdminBoundaries]);



  const handleShowTimeseries = () => {
    setShowTimeseries(!showTimeseries)
  }



  const handleSelectThematicLayer = (e) => {
    const selectedValue = e.target.value;
    const selectedLayer = ThematicLayersOptions.find(item => item.value === selectedValue);
    setSelectedThematicLayers(prevState =>
      prevState.some(layer => layer.value === selectedValue)
        ? prevState.filter(layer => layer.value !== selectedValue)
        : [...prevState, selectedLayer]
    );
  };

  const handleSelectMapData = (e) => {
    const selectedDataValue = e.target.value;
    const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
    setSelectedRasterLayer("")
    setSelectedVariable(null)
    setSelectedData(null)
    setSelectedAdminBoundaries("")
    setSelectedState("")
    setSelectedDistrict("")
    setSelectedTehsil("")
    setSelectedDataQuery(selectedData);

  };

  const handleSelectVariable = (e) => {
    const selectedOptionValue = e.target.value;
    const selectedOption = selectedDataQuery && selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
    setSelectedVariable(selectedOption);
    setShowTimeseries(false)
    setSelectedState("")
    setSelectedData(null)
    setSelectedDistrict("")
    setSelectedTehsil("")
    setSelectedAdminBoundaries("")
  };



  const handleStateSelect = (event, value) => {
    let items = PlaceAttributes.filter((item) => item.STATE === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();

    setDistrictList(items);
    setSelectedState(value)
    setSelectedDistrict("")
    setSelectedTehsil("")

    const filteredData = geojsonJsonData.features.filter((item) => item.properties.STATE === value)


    setSelectedAdminUnit({
      type: "FeatureCollection",
      features: filteredData,
    });


    if (selectedAdminBoundaries === "State") {
      setSelectedFeature({
        featureType: "STATE",
        featureName: value
      })
      setShowTimeseries(true)

    }
  };



  const handleDistrictSelect = (event, value) => {

    let items = PlaceAttributes.filter((item) => item.DISTRICT === value && item.STATE === selectedState);
    items = [...new Set(items.map((item) => item))];
    items.sort();

    setTalukaList(items);
    setSelectedDistrict(value)
    setSelectedTehsil("")


    const filteredData = geojsonJsonData.features.filter((item) => item.properties.DISTRICT === value && item.properties.STATE === selectedState)

    setSelectedAdminUnit({
      type: "FeatureCollection",
      features: filteredData,
    });

    if (selectedAdminBoundaries === "District") {
      setSelectedFeature({
        featureType: "DISTRICT",
        featureName: value
      })
      setShowTimeseries(true)

    }



  };

  const handleTalukaSelect = (event, value) => {

    let items = PlaceAttributes.filter((item) => item.TEHSIL === value && item.DISTRICT === selectedDistrict);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setSelectedTehsil(value)

    const filteredData = geojsonJsonData.features.filter((item) => item.properties.TEHSIL === value && item.properties.DISTRICT === selectedDistrict && item.properties.STATE === selectedState)

    setSelectedAdminUnit({
      type: "FeatureCollection",
      features: filteredData,
    });


    if (selectedAdminBoundaries === "Tehsil") {
      setSelectedFeature({
        featureType: "TEHSIL",
        featureName: value
      })
      setShowTimeseries(true)
    }



  };



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
          console.log(jsonData)
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



  const handleCancelSelection = () => {
    setUploadeddata([]); // Reset the uploaded data state
    if (fileInputRef.current) {
      fileInputRef.current.value = null;  // Correctly reset the input
    }

  };

  const handleRasterLayerSelection = (e) => {
    const value = e.target.value;
    setSelectedDataQuery(null)
    setSelectedRasterLayer((prevSelectedRaster) =>
      prevSelectedRaster === value ? '' : value
    );
    setShowTimeseries(false)
  };

  const handleOpacityChange = (e) => {
    setRasterLayerOpacity(parseFloat(e.target.value));
  };


  const handleVectorLayerSelection = (e) => {
    setSelectedAdminBoundaries(e.target.value);
    setShowTimeseries(false)
    setSelectedDistrict("")
    setSelectedTehsil("")
    setSelectedState("")
  };


  return (

    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Visualise climate risks | CRAI</title>
      </Head>

      <div className='dasboard_page_container'>


        <div className='main_dashboard'>
          <div className='left_panel'>

            <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>

              <div className="accordion" >

                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingSelectData">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSelectData" aria-expanded="true" aria-controls="panelsStayOpen-collapseSelectData">
                      Select data
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseSelectData" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSelectData">

                    <div className="accordion-body">
                      <div className='map_layers'>
                        <select className="form-select mb-3"
                          value={selectedDataQuery ? selectedDataQuery.DataValue : ''}
                          onChange={handleSelectMapData}
                        >
                          <option value="">Select</option>
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

                        <select
                          className="form-select mb-3"
                          value={selectedVariable ? selectedVariable.DataValue : ''}
                          onChange={handleSelectVariable}
                          disabled={!selectedDataQuery}
                        >
                          <option value="">Select</option>
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
                  <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                    <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="frue" aria-controls="panelsStayOpen-collapseTwo">
                      Administrative units for visualisation
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                    <div className="accordion-body">


                      <select
                        className="form-select mb-3"
                        onChange={handleVectorLayerSelection}
                        disabled={!selectedVariable || !selectedDataQuery}
                        value={selectedAdminBoundaries}
                      >
                        <option value="">Select</option>

                        {selectedDataQuery && selectedDataQuery.AdminBoundary && selectedDataQuery.AdminBoundary.map((item, index) => (
                          <option key={index} value={item}>{item}</option>
                        ))}


                      </select>





                    </div>
                  </div>
                </div>


                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-heading3">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse3" aria-expanded="true" aria-controls="panelsStayOpen-collapse3">
                      Select by administrative units
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapse3" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading3">

                    <div className="accordion-body">
                      <div className='map_layers'>

                        <label>Select State</label>
                        <select
                          className="form-select mb-3"
                          value={selectedState}
                          onChange={(event) => handleStateSelect(event, event.target.value)}
                          disabled={!selectedVariable || !selectedDataQuery}
                        >
                          <option value="">Select State</option>

                          {PlaceAttributes &&
                            [...new Set(PlaceAttributes.map(item => item.STATE))].sort().map((state, index) => (
                              <option key={index} value={state}>{state}</option>
                            ))}
                        </select>

                        <label >Select District</label>
                        <select
                          value={selectedDistrict}
                          className="form-select mb-3"
                          onChange={(event) => handleDistrictSelect(event, event.target.value)}
                          disabled={districtList.length === 0 || selectedAdminBoundaries === "State" || !selectedDataQuery}
                        >
                          <option value="">Select District</option>

                          {districtList.length > 0 &&
                            [...new Set(districtList.map(item => item.DISTRICT))].sort().map((district, index) => (
                              <option key={index} value={district}>{district}</option>
                            ))}
                        </select>

                        <label value="">Select Tehsil</label>
                        <select
                          value={selectedTehsil}
                          className="form-select mb-3"
                          onChange={(event) => handleTalukaSelect(event, event.target.value)}
                          disabled={talukaList.length === 0 || selectedAdminBoundaries === "District" || selectedAdminBoundaries === "State" || !selectedDataQuery}
                        >
                          <option value="">Select Tehsil</option>

                          {talukaList.length > 0 &&
                            [...new Set(talukaList.map(item => item.TEHSIL))].sort().map((taluka, index) => (
                              <option key={index} value={taluka}>{taluka}</option>
                            ))}
                        </select>



                        { selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && (
                          <div className='panel_button'>
                            <button type='button'
                              // disabled={!selectedAdminBoundaries}
                              onClick={handleShowTimeseries}>
                              {showTimeseries ? "Hide Chart" : "Show Chart"}
                            </button>
                          </div>
                        )}





                      </div>

                    </div>



                  </div>
                </div>




                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      Raster layers
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                    <div className="accordion-body">

                      {RasterDataOptions.map((option, index) => (
                        <div key={index} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={option.value}
                            value={option.value}
                            checked={selectedRasterLayer && selectedRasterLayer === option.value}
                            onChange={handleRasterLayerSelection}
                          />
                          <label className="form-check-label" htmlFor={option.value}>{option.name}</label>



                        </div>
                      ))}


                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingThematicLayers">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThematicLayers" aria-expanded="true" aria-controls="panelsStayOpen-collapseThematicLayers">
                      Overlay thematic layers
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseThematicLayers" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThematicLayers">

                    <div className="accordion-body">


                      {ThematicLayersOptions.map((item, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={item.value}
                            value={item.value}
                            checked={selectedThematicLayers.some(layer => layer.value === item.value)}
                            onChange={handleSelectThematicLayer}
                          />
                          <label htmlFor={item.value}>{item.LayerName}</label>
                        </div>
                      ))}




                    </div>
                  </div>
                </div>


                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingUploadData">
                    <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseUploadData" aria-expanded="true" aria-controls="panelsStayOpen-collapseUploadData">
                      Upload your own data
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseUploadData" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingUploadData">
                    <div className="accordion-body">
                      <div>
                        <label className="form-label">Upload point data in .csv or polygon data in .geojson format</label>

                        <div className="input-group mb-3">
                          <input
                            className="form-control"
                            type="file" accept=".csv,.geojson"
                            onChange={handleFileChange}
                            title='Only .csv or .geojson files are accepted'
                            ref={fileInputRef}
                          />
                          <button className="btn btn-outline-secondary"
                            onClick={handleCancelSelection}
                            disabled={!uploadeddata || uploadeddata.length === 0}
                            type="button" id="button-addon2"><MdDeleteForever /></button>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>









              </div>

              {/* <div className='panel_button'>
                <button type='button'
                  onClick={handleShowTimeseries}>
                  {showTimeseries ? "Hide Timeseries" : "Show Timeseries"}
                </button>
              </div> */}


            </div>



          </div>

          <div className='right_panel' ref={mapContainerRef}>
            <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>


              <VisualizeRiskMap
                handleShowTimeseries={handleShowTimeseries}
                selectedRasterLayer={selectedRasterLayer}
                selectedDataQuery={selectedDataQuery}
                selectedVariable={selectedVariable}
                selectedAdminBoundaries={selectedAdminBoundaries}
                rasterLayerOpacity={rasterLayerOpacity}
                setSelectedFeature={setSelectedFeature}
                selectedFeature={selectedFeature}
                mapContainerRef={mapContainerRef}
                selectedData={selectedData}
                geojsonJsonData={selectedAdminUnit}
                ColorLegendsDataItem={colorLegendsDataItem}
                setShowTimeseries={setShowTimeseries}
                uploadeddata={uploadeddata}
                selectedThematicLayers={selectedThematicLayers} />


              {showTimeseries && selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && (
                <div className='time_series_container'>
                  <VisualiseRiskChart
                    handleShowTimeseries={handleShowTimeseries}
                    selectedFeature={selectedFeature}
                    selectedData={selectedData}
                    selectedDataQuery={selectedDataQuery}

                  />

                </div>
              )}

            </div>


            {loading && (
              <div className='map_layer_loader_container_desktop' style={{ width: "80vw" }}>
                <div className="map_loader_container">
                  <span className="map_loader"></span>
                </div>

              </div>

            )}



          </div>
        </div>
      </div>



    </>
  )
}

export default ClimateRiskPage