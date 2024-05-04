import React, { Suspense, useEffect, useRef, useState } from 'react'
import { BaseMapsLayers } from '../helpers/mapFunction';
import dynamic from 'next/dynamic';
import Preloader from '../components/Preloader';
import MapLoader from '@/components/MapLoader';
import Head from 'next/head';
import cyclone_legend from "../../public/images/cyclone_legend.jpg"
import flood_legend from "../../public/images/flood_legend.jpg"
import drought_legend from "../../public/images/drought_legend.jpg"
import ShortFooter from '@/components/ShortFooter';

const VisualizeRiskMap = dynamic(() => import('@/components/VisualizeRiskMap'), {
  ssr: false,
  loading: () => <MapLoader />

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
  {
    DataName: "Hydrometeorological disasters",
    DataValue: "hydrometeorological_disasters",
    AdminBoundary: ["District"],
    variables: [

      {
        name: "Flood pentad",
        value: "flood_pentad_occurrence",
        legendTitel:"Frequency of flood",
        legendImg:flood_legend,
      },
      {
        name: "Drought pentad",
        value: "drought_pentad_occurrence",
        legendTitel:"Frequency of drought",
        legendImg:drought_legend,
      },
      {
        name: "Cyclone pentad",
        value: "cyclone_pentad_occurrence",
        legendTitel:"Frequency of cyclone",
        legendImg:cyclone_legend,
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
  const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedDataQuery, setSelectedDataQuery] = useState(null);

  const mapContainerRef = useRef(null);

  const [selectedData, setSelectedData] = useState(null);


  const [geojsonJsonData, setGeojsonJsonData] = useState(null);



  useEffect(() => {
    if (selectedAdminBoundaries !== "" && selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && selectedVariable && selectedVariable.value) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/monsoonData?type=${selectedAdminBoundaries}`);
          const geojsonresponse = await import(`../../public/data/shapefiles/India${selectedAdminBoundaries}s.json`);
          setGeojsonJsonData(geojsonresponse.default);

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
          const geojsonresponse = await import(`../../public/data/shapefiles/India${selectedAdminBoundaries}s.json`);
          setGeojsonJsonData(geojsonresponse.default);

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






  const handleBasemapSelection = (e) => {
    const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
    setSelectedBasemapLayer(selectedItem);


  };



  const handleSelectMapData = (e) => {
    const selectedDataValue = e.target.value;
    const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
    setSelectedRasterLayer("")
    setSelectedVariable(null)
    setSelectedAdminBoundaries("")
    setSelectedDataQuery(selectedData);
  };

  const handleSelectVariable = (e) => {
    const selectedOptionValue = e.target.value;
    const selectedOption = selectedDataQuery && selectedDataQuery.variables.find(variable => variable.value === selectedOptionValue);
    setSelectedVariable(selectedOption);
  };




  const handleRasterLayerSelection = (e) => {
    const value = e.target.value;
    setSelectedDataQuery(null)
    setSelectedRasterLayer((prevSelectedRaster) =>
      prevSelectedRaster === value ? '' : value
    );
  };

  const handleOpacityChange = (e) => {
    setRasterLayerOpacity(parseFloat(e.target.value));
  };


  const handleVectorLayerSelection = (e) => {
    setSelectedAdminBoundaries(e.target.value);
  };


  return (

    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Visualise climate risks</title>
      </Head>

      <div className='dasboard_page_container'>


        <div className='main_dashboard'>
          <div className='left_panel'>

            <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>

              <div className="accordion" >

                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-heading3">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse3" aria-expanded="true" aria-controls="panelsStayOpen-collapse3">
                      Select data
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapse3" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading3">

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
                      Select administrative units
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                    <div className="accordion-body">


                      <select
                        className="form-select mb-3"
                        onChange={handleVectorLayerSelection}
                        disabled={!selectedVariable | !selectedDataQuery}
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
                  <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseThree">
                      Base map
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThree">
                    <div className="accordion-body">
                      {BaseMapsLayers.map((option, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="radio"
                            id={option.name}
                            className="form-check-input"
                            value={option.name}
                            checked={selectedBasemapLayer.name === option.name}
                            onChange={handleBasemapSelection}
                          />
                          <label className="form-check-label" htmlFor={option.name}>{option.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>



              </div>


            </div>



          </div>

          <div className='right_panel' ref={mapContainerRef}>


            <VisualizeRiskMap
              selectedBasemapLayer={selectedBasemapLayer}
              selectedRasterLayer={selectedRasterLayer}
              selectedDataQuery={selectedDataQuery}
              selectedVariable={selectedVariable}
              selectedAdminBoundaries={selectedAdminBoundaries}
              rasterLayerOpacity={rasterLayerOpacity}
              mapContainerRef={mapContainerRef}
              selectedData={selectedData}
              geojsonJsonData={geojsonJsonData}
            />


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