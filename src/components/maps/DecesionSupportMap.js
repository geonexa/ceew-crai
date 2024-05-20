import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON, TileLayer, ImageOverlay, ScaleControl, useMap, Circle, Marker, Popup, Tooltip } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";



import monsoon_anomaly_legend from "../../../public/images/monsoon_anomaly_legend.jpg"
import marker_icon from "../../../public/images/marker_icon.png"
import IndiaStates from '../../../public/data/shapefiles/IndiaStates.json';
import Image from 'next/image';
import FiltererdGeojsonData from '../FiltererdGeojsonData';
import { fillDensityColor } from '@/helpers/functions';
import { ColorLegendsData } from '../../../public/data/ColorLegendsData';



const DecesionSupportMap = ({ selectedState, selectedDistrict, selectedDataQuery, selectedTehsil, selectedVariable, uploadeddata, mapNumber }) => {

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
          const geojsonresponse = await import(`../../../public/data/shapefiles/IndiaTehsils.json`);
          const filteredGeojson = geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState)
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
  }, [selectedDataQuery, selectedVariable, selectedState]);




  useEffect(() => {
    if (selectedDataQuery && selectedDataQuery.DataValue === "hydrometeorological_disasters" && selectedVariable && selectedVariable.value && selectedState) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/hydrometeorologicalData?type=${selectedVariable.value}`);

          const geojsonresponse = await import(`../../../public/data/shapefiles/India${`District`}s.json`);
          const filteredGeojson = geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState)
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
  }, [selectedVariable, selectedDataQuery, selectedState]);





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






  const TalukaStyle = (feature => {

    const getDensityFromData = (ID) => {
      const DataItem = selectedData.find(item => item.ID === ID);
      return DataItem ? DataItem[selectedVariable.value] : null;
    };

    const density = getDensityFromData(feature.properties.ID);

    return ({
      fillColor: colorLegendsDataItem && density ? fillDensityColor(colorLegendsDataItem, density) : "none",
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



  const renderMarkers = () => {
    return uploadeddata.map((item, index) => (
      <Marker
        key={index}
        position={[parseFloat(item.Latitude), parseFloat(item.Longitude)]}
        icon={L.icon({
          iconUrl: marker_icon.src,
          iconRetinaUrl: marker_icon.src,
          iconSize: [15],
          popupAnchor: [0, -5],
        })}
      >
        <Tooltip>{`ID: ${item.ID}`}</Tooltip>
      </Marker>
    ));
  };

  const renderGeoJSON = () => {
    return (
      <GeoJSON
        data={uploadeddata}
        style={{ fillColor: 'none', weight: 3, color: 'yellow', fillOpacity: "0.4" }}
      />
    );
  };



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
        // scrollWheelZoom={false}
        doubleClickZoom={false}
      >

        {selectedState && selectedVariable ? (
          <>
            <div className='decision_map_heading'>
              <p> {selectedVariable.name} </p>
            </div>

            <div className="legend_panel_container" style={{ width: "270px", bottom: "5px", right: "5px", backgroundColor: "whitesmoke", borderRadius: "5px" }}>
              <div className="item-heading" >
                <p style={{ fontSize: "12px" }}>Changes in last decade (2012-2022) compared to climate baseline (1982-2011) (in %)</p>
              </div>
              <Image style={{ width: "100%" }} src={monsoon_anomaly_legend} alt='Legend' />
            </div>


            {selectedData && selectedDataQuery && selectedDataQuery.DataValue === "MonsoonData" && (
              <FiltererdGeojsonData
                filteredDataStyle={TalukaStyle}
                filteredDataOnEachfeature={TalukaOnEachfeature}
                datakey={`${selectedState}+${selectedDistrict}+${selectedTehsil}`}
                filteredData={geojsonJsonData}
              />

            )}

            {selectedData && selectedDataQuery && selectedDataQuery.DataValue === "hydrometeorological_disasters" && (
              <FiltererdGeojsonData
                filteredDataStyle={TalukaStyle}
                filteredDataOnEachfeature={TalukaOnEachfeature}
                datakey={`${selectedState}+${selectedDistrict}+${selectedTehsil}`}
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


        {uploadeddata && uploadeddata.type === "FeatureCollection" ? (
          renderGeoJSON()
        ) : (
          renderMarkers()

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