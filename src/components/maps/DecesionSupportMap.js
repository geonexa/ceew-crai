import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON, TileLayer, ImageOverlay, ScaleControl, useMap, Circle, Marker, Popup, Tooltip } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import IndiaStates from '../../../public/data/Admin_Boundary/IndiaStates.json';
import FiltererdGeojsonData from '../FiltererdGeojsonData';
import { fillDensityColor } from '@/helpers/functions';
import { ColorLegendsData } from '../../../public/data/ColorLegendsData';
import DynamicSmallLegend from '../DynamicSmallLegend';



const DecesionSupportMap = ({ selectedState, selectedDistrict, selectedDataQuery, selectedTehsil, selectedVariable, mapNumber }) => {
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geojsonJsonData, setGeojsonJsonData] = useState(null);
  const [colorLegendsDataItem, setColorLegendsDataItem] = useState(null)



  useEffect(() => {
    if (selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && selectedVariable && selectedVariable.value && selectedState) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/monsoonData?type=Tehsil`);
          const geojsonresponse = await import(`../../../public/data/Admin_Boundary/IndiaTehsils.json`);

          const filteredGeojson = selectedDistrict ? geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState && item.properties.DISTRICT === selectedDistrict):
          geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState)

          setGeojsonJsonData(filteredGeojson);
          setColorLegendsDataItem(ColorLegendsData.monsoon_palette)

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
  }, [selectedDataQuery, selectedVariable, selectedState,selectedDistrict]);





  useEffect(() => {
    if (selectedDataQuery && selectedDataQuery.DataValue === "hydrometeorological_disasters" && selectedVariable && selectedVariable.value && selectedState) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/hydrometeorologicalData?type=${selectedVariable.value}`);

          const geojsonresponse = await import(`../../../public/data/Admin_Boundary/India${`District`}s.json`);
          const filteredGeojson = selectedDistrict ? geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState && item.properties.DISTRICT === selectedDistrict):
          geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState)
          setGeojsonJsonData(filteredGeojson);
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
  }, [selectedVariable, selectedDataQuery, selectedState,selectedDistrict]);



  console.log(colorLegendsDataItem)

  function TalukaOnEachfeature(feature, layer) {
    layer.on('mouseover', function () {
      const DataItem = selectedData && selectedData.find(item => item.ID === feature.properties.ID);

      if (selectedVariable && selectedVariable.value && DataItem) {
        let popupContent;
        const value = DataItem[selectedVariable.value] ? DataItem[selectedVariable.value].toFixed(2) : "NA"

        popupContent = `
        <div>
        STATE: ${DataItem.STATE}<br/>
        DISTRICT: ${DataItem.DISTRICT}<br/>
        TEHSIL: ${DataItem.TEHSIL}<br/>
        VALUE: ${value}
        </div>
`;

        layer.bindTooltip(popupContent, { sticky: true });
      }
      layer.openTooltip();
    });

    layer.on('mouseout', function () {
      layer.closeTooltip();
    });
  }

  function DistrictOnEachfeature(feature, layer) {
    layer.on('mouseover', function () {
      const DataItem = selectedData && selectedData.find(item => item.DISTRICT === feature.properties.DISTRICT);

      if (DataItem && selectedVariable && selectedVariable.value && feature.properties && feature.properties.DISTRICT) {
        let popupContent;
        const value = DataItem[selectedVariable.value] ? DataItem[selectedVariable.value].toFixed(2) : "NA"

        popupContent = `
          <div>
          STATE: ${DataItem.STATE}<br/>
          DISTRICT: ${DataItem.DISTRICT}<br/>
          VALUE: ${value}
          </div>
  `;

        layer.bindTooltip(popupContent, { sticky: true });
      }
      layer.openTooltip();
    });

    layer.on('mouseout', function () {
      layer.closeTooltip();
    });
  }

  const TalukaStyle = (feature => {
    const getDensityFromData = (ID) => {
      const DataItem = selectedData && selectedData.find(item => item.ID === ID);
      return DataItem ? DataItem[selectedVariable.value] : null;
    };

    const density = getDensityFromData(feature.properties.ID);

    return ({
      fillColor: colorLegendsDataItem  ? fillDensityColor(colorLegendsDataItem, density) : "none",
      // fillColor: "blue",
      weight: 0.5,
      opacity: 1,
      color: 'black',
      // dashArray: '2',
      fillOpacity: 1
    });
  });





  const DistrictStyle = (feature => {
    const getDensityFromData = (DISTRICT, STATE) => {
      const DataItem = selectedData && selectedData.find(item => item.DISTRICT === DISTRICT && item.STATE === STATE);
      return DataItem && selectedVariable ? DataItem[selectedVariable.value] : null;
    };

    const density = getDensityFromData(feature.properties.DISTRICT, feature.properties.STATE);

    return ({
      fillColor: colorLegendsDataItem  ? fillDensityColor(colorLegendsDataItem, density) : "none",
      // fillColor: "blue",
      weight: 0.5,
      opacity: 1,
      color: 'black',
      // dashArray: '2',
      fillOpacity: 1
    });
  });




  const mapCenter = [23, 84]

  const setInitialMapZoom = () => {
    var viewportWidth = window.innerWidth;
    var mapZoom;
    if (viewportWidth <= [767]) {
      mapZoom = [3];
    } if (viewportWidth >= [768]) {
      mapZoom = [3.3];
    } if (viewportWidth >= [1600]) {
      mapZoom = [4];
    }
    return mapZoom;
  }
  const setDragging = () => {
    var viewportWidth = window.innerWidth;
    var dragging;
    if (viewportWidth <= [767]) {
      dragging = false;
    } if (viewportWidth >= [768]) {
      dragging = true;
    }
    return dragging;
  }


  const maxBounds = L.latLngBounds(
    L.latLng(0, 70),
    L.latLng(35, 130)
  );







  return (
    <>
      <MapContainer
        // fullscreenControl={true}
        center={mapCenter}
        style={{ width: '100%', height: "100%", backgroundColor: 'white', border: 'none', margin: 'auto' }}
        zoom={setInitialMapZoom()}
        // maxBounds={maxBounds}
        // maxZoom={8}
        minZoom={setInitialMapZoom()}
        keyboard={false}
        dragging={setDragging()}
        attributionControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >

        {selectedState && selectedVariable ? (
          <>
            <div className='decision_map_heading'>
              <p> {selectedVariable.name} </p>
            </div>
            {colorLegendsDataItem && 
            <DynamicSmallLegend ColorLegendsDataItem={colorLegendsDataItem}/>
            }



            {selectedData && selectedDataQuery && geojsonJsonData && selectedDataQuery.DataValue === "MonsoonData" && (
              <FiltererdGeojsonData
                filteredDataStyle={TalukaStyle}
                filteredDataOnEachfeature={TalukaOnEachfeature}
                datakey={`${selectedState}+${selectedDistrict}+${selectedTehsil}+${selectedData && selectedData.lenght}+${geojsonJsonData && geojsonJsonData.length}+${geojsonJsonData && geojsonJsonData.lenght>0 && geojsonJsonData[0].properties.ID}`}
                filteredData={geojsonJsonData}
              />

            )}

            {selectedData && selectedDataQuery && geojsonJsonData&& selectedDataQuery.DataValue === "hydrometeorological_disasters" && (
              <FiltererdGeojsonData
                filteredDataStyle={DistrictStyle}
                filteredDataOnEachfeature={DistrictOnEachfeature}
                datakey={`${selectedState}+${selectedDistrict}+${selectedTehsil}+${selectedData && selectedData.length}+${geojsonJsonData && geojsonJsonData.length}+${geojsonJsonData && geojsonJsonData.lenght>0 && geojsonJsonData[0].properties.ID}`}
                filteredData={geojsonJsonData}
              />


            )}


          </>
        ) : (
          <>
            <div className='decision_map_heading' style={{ width: "100px", right: "10px" }}>
              <p> {mapNumber} </p>
            </div>

            <GeoJSON
              key={selectedState + selectedDistrict + selectedTehsil}
              style={{
                fillColor: "black",
                weight: 1,
                color: "black",
                fillOpacity: "0.001",
                interactive: false,
              }}
              data={IndiaStates.features}
            />
          </>

        )}




        {loading && (
          <div className='map_layer_loader_container_desktop'>
            <div className="map_loader_container">
              <span className="map_loader"></span>
            </div>

          </div>

        )}


        <ScaleControl />

      </MapContainer>




    </>
  )
}

export default DecesionSupportMap