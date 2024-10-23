
import React, { useEffect, useState } from 'react'
import SearchBar from "../SearchBar";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import BaseMap from './Basemap';
import Image from 'next/image';
import ExportMapButton from '../ExportMapButton';
import { BaseMapsLayers } from '@/helpers/mapFunction';
import FiltererdGeojsonData from '../FiltererdGeojsonData';
import { fillDensityColor } from '@/helpers/functions';
import DynamicLegend from '../DynamicLegend';


const AdaptationToolMap = ({ selectedData, geojsonJsonData, selectedSector, selectedState, setLoading, ColorLegendsDataItem, selectedComponent, mapContainerRef }) => {
    const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);

    const handleBasemapSelection = (e) => {
        const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
        setSelectedBasemapLayer(selectedItem);
    };



    function DistrictOnEachfeature(feature, layer) {
        layer.on('mouseover', function () {
            const DataItem = selectedData && selectedData.find(item => item.DISTRICT === feature.properties.DISTRICT);
            if (DataItem) {
                let popupContent;
                const value = DataItem[selectedComponent.value] !== null && DataItem[selectedComponent.value] !== undefined
                    ? DataItem[selectedComponent.value].toFixed(2)
                    : "NA";

                popupContent = `
                <div>
                STATE: ${DataItem.STATE}<br/>
                DISTRICT: ${DataItem.DISTRICT}<br/>
                ${selectedComponent.name}: ${value}
                </div>
        `;

                layer.bindTooltip(popupContent, { sticky: true });
            } else {
                let popupContent;

                popupContent = `
                <div>
                DISTRICT: ${feature.properties.DISTRICT}<br/>
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



    const DistrictStyle = feature => {
        const getDensityFromData = (DISTRICT, STATE) => {
            const DataItem = selectedData && selectedData.find(item => item.DISTRICT === DISTRICT && item.STATE === STATE);
            return DataItem && selectedComponent ? DataItem[selectedComponent.value] : null;
        };

        const density = getDensityFromData(feature.properties.DISTRICT, feature.properties.STATE);

        return {
            fillColor: ColorLegendsDataItem ? fillDensityColor(ColorLegendsDataItem, density) : "none",
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        };
    };





    const mapCenter = [23, 84]

    const setInitialMapZoom = () => {
        var viewportWidth = window.innerWidth;
        var mapZoom;
        if (viewportWidth <= [767]) {
            mapZoom = [4];
        } if (viewportWidth >= [768]) {
            mapZoom = [4.3];
        } if (viewportWidth >= [1600]) {
            mapZoom = [5];
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
        L.latLng(0, 80),
        L.latLng(35, 120)
    );


    return (
        <>
            <MapContainer
                fullscreenControl={true}
                center={mapCenter}
                style={{ width: '100%', height: "100%", backgroundColor: 'white', border: 'none', margin: 'auto', borderRadius: "5px" }}
                zoom={setInitialMapZoom()}
                // maxBounds={maxBounds}
                // maxZoom={8}
                minZoom={setInitialMapZoom()}
                keyboard={false}
                dragging={setDragging()}
                // attributionControl={false}
                // scrollWheelZoom={false}
                doubleClickZoom={false}
            >



                <div className='map_layer_manager'>
                    <div className="accordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingBasemap">
                                <button className="accordion-button map_layer_collapse collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseBasemap" aria-expanded="false" aria-controls="panelsStayOpen-collapseBasemap">
                                    Base Map
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseBasemap" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingBasemap">
                                <div className="accordion-body map_layer_collapse_body">
                                    {BaseMapsLayers.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id={option.name}
                                                name="data_type"
                                                value={option.name}
                                                checked={selectedBasemapLayer?.name === option.name}
                                                onChange={handleBasemapSelection}
                                            />
                                            <label htmlFor={option.name}>{option.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>



                <BaseMap />
                {/* <SearchBar /> */}
                {/* <ExportMapButton mapContainerRef={mapContainerRef} selectedYear="2020" selectedSession="June" /> */}
                <TileLayer
                    key={selectedBasemapLayer.url}
                    attribution={selectedBasemapLayer.attribution}
                    url={selectedBasemapLayer.url}
                    subdomains={selectedBasemapLayer.subdomains}
                />



                {geojsonJsonData && selectedComponent && (

                    <>
                        <FiltererdGeojsonData
                            datakey={`${geojsonJsonData} + ${selectedData && selectedData.length}+${selectedComponent && selectedComponent.value}`}
                            filteredData={geojsonJsonData}
                            filteredDataOnEachfeature={DistrictOnEachfeature}
                            filteredDataStyle={DistrictStyle}
                        />
                        <DynamicLegend ColorLegendsDataItem={ColorLegendsDataItem} />



                    </>



                )}








            </MapContainer>
        </>
    )
}

export default AdaptationToolMap