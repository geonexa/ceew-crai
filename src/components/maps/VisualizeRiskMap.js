
import React, { useEffect, useState } from 'react'
import SearchBar from "../SearchBar";
import { MapContainer, GeoJSON, TileLayer, ImageOverlay } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import BaseMap from '../Basemap';
import Image from 'next/image';
import IndiaClimateZones from "../../../public/images/IndiaClimateZones_1991_2020.png"
import climate_zones_legend from "../../../public/images/climate_zones_legend.jpg"
import monsoon_anomaly_legend from "../../../public/images/monsoon_anomaly_legend.jpg"

import IndiaBoundary from '../../../public/data/shapefiles/IndiaBoundary.json';



import ExportMapButton from '../ExportMapButton';
import { BaseMapsLayers } from '@/helpers/mapFunction';
import { fillDensityColor } from '@/helpers/functions';

const VisualizeRiskMap = ({ setShowTimeseries, setSelectedFeature, selectedRasterLayer, ColorLegendsDataItem, selectedDataQuery, selectedVariable, selectedAdminBoundaries, rasterLayerOpacity, mapContainerRef, selectedData, geojsonJsonData }) => {




    const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);


    const handleBasemapSelection = (e) => {
        const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
        setSelectedBasemapLayer(selectedItem);


    };


    function TalukaOnEachfeature(feature, layer) {

        layer.on('click', function (e) {
            setSelectedFeature({
                featureType:"TEHSIL",
                featureName:feature.properties["TEHSIL"]
            })
            setShowTimeseries(true)
        });

        

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

        layer.on('click', function (e) {
            setSelectedFeature({
                featureType:"DISTRICT",
                featureName:feature.properties["DISTRICT"]
            })
            setShowTimeseries(true)
        })

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



    function StateOnEachfeature(feature, layer) {
        layer.on('click', function (e) {
            setSelectedFeature({
                featureType:"STATE",
                featureName:feature.properties["STATE"]
            })
            setShowTimeseries(true)
        });



        layer.on('mouseover', function () {
            const DataItem = selectedData && selectedData.find(item => item.STATE === feature.properties.STATE);

            if (DataItem && selectedVariable && selectedVariable.value && feature.properties && feature.properties.STATE) {
                let popupContent;
                const value = DataItem[selectedVariable.value] ? DataItem[selectedVariable.value].toFixed(2) : "NA"

                popupContent = `
                <div>
                STATE: ${DataItem.STATE}<br/>
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





    const DistrictHydrometeorologicalStyle = feature => {
        const getDensityFromData = (DISTRICT, STATE) => {
            const DataItem = selectedData && selectedData.find(item => item.DISTRICT === DISTRICT && item.STATE === STATE);
            return DataItem && selectedVariable ? DataItem[selectedVariable.value] : null;
        };

        const density = getDensityFromData(feature.properties.DISTRICT, feature.properties.STATE);



        return {
            // fillColor: density ? SelectedFunction(density) : "none",\
            fillColor: ColorLegendsDataItem && density ? fillDensityColor(ColorLegendsDataItem, density) : "none",
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        };
    };





    const TalukaStyle = (feature => {
        const getDensityFromSummerData = (ID) => {
            const DataItem = selectedData.find(item => item.ID === ID);
            return DataItem && selectedVariable ? DataItem[selectedVariable.value] : null;
        };

        const density = getDensityFromSummerData(feature.properties.ID);

        return ({
            fillColor: ColorLegendsDataItem && density ? fillDensityColor(ColorLegendsDataItem, density) : "none",
            weight: 0.5,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        });
    });


    const DistrictMonsoonStyle = (feature => {
        const getDensityFromData = (DISTRICT) => {
            const DataItem = selectedData.find(item => item.DISTRICT === DISTRICT);
            return DataItem && selectedVariable ? DataItem[selectedVariable.value] : null;
        };

        const density = getDensityFromData(feature.properties.DISTRICT);

        return ({
            fillColor: ColorLegendsDataItem && density ? fillDensityColor(ColorLegendsDataItem, density) : "none",
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        });
    });




    const StateStyle = (feature => {
        const getDensityFromSummerData = (STATE) => {
            const DataItem = selectedData.find(item => item.STATE === STATE);
            return DataItem && selectedVariable ? DataItem[selectedVariable.value] : null;
        };

        const density = getDensityFromSummerData(feature.properties.STATE);

        return ({
            fillColor: ColorLegendsDataItem && density ? fillDensityColor(ColorLegendsDataItem, density) : "none",
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        });
    });




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
        L.latLng(0, 70),
        L.latLng(35, 130)
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
                <SearchBar />
                {/* <ExportMapButton mapContainerRef={mapContainerRef} selectedYear="2020" selectedSession="June" /> */}
                <TileLayer
                    key={selectedBasemapLayer.url}
                    attribution={selectedBasemapLayer.attribution}
                    url={selectedBasemapLayer.url}
                    subdomains={selectedBasemapLayer.subdomains}
                />


                {selectedRasterLayer === "climate_zones_map" && (
                    <>
                        <div className="legend_image_container" style={{ width: "200px" }}>
                            <Image
                                src={climate_zones_legend}
                                alt="Legend_Img"

                            />
                        </div>

                        <ImageOverlay
                            opacity={rasterLayerOpacity}
                            attribution="Data Source: <a href='https://www.gloh2o.org/koppen/' target='_blank'>Köppen-Geiger
                            Global climate classification (1991-2020)</a>"
                            key="Irrigated_Rainfed"
                            url={IndiaClimateZones.src}
                            fitBounds={true}
                            // interactive={true}
                            bounds={[
                                [6.7583333329999995, 97.4],
                                [37.083333333, 68.125],
                            ]}

                        />

                        <GeoJSON
                            interactive={false}
                            style={{
                                fillColor: "none",
                                weight: 2,
                                color: "black",
                                fillOpacity: "0",
                                interactive: false,
                            }}
                            data={IndiaBoundary.features}
                        />

                    </>

                )}




                {selectedDataQuery && geojsonJsonData && selectedData && selectedDataQuery.DataValue === "MonsoonData" && selectedVariable && selectedAdminBoundaries !== "" && (
                    <>

                        <div className="legend_panel_container" style={{ width: "320px", bottom: "60px", padding: "5px", right: "10px", backgroundColor: "white", borderRadius: "5px" }}>
                            <div className="item-heading" >
                                <p style={{ fontSize: "14px" }}>Changes in last decade (2012-2022) compared to climate baseline (1982-2011) (in %)</p>
                            </div>
                            <Image src={monsoon_anomaly_legend} alt='Legend' />
                        </div>



                        {selectedAdminBoundaries === "Tehsil" ? (
                            <>

                                <GeoJSON
                                    key={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}`}
                                    style={TalukaStyle}
                                    data={geojsonJsonData.features}
                                    onEachFeature={TalukaOnEachfeature}
                                />

                            </>


                        ) : selectedAdminBoundaries === "District" ? (
                            <>

                                <GeoJSON
                                    key={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}`}
                                    style={DistrictMonsoonStyle}
                                    data={geojsonJsonData.features}
                                    onEachFeature={DistrictOnEachfeature}
                                />

                            </>


                        ) : selectedAdminBoundaries === "State" ? (
                            <>

                                <GeoJSON
                                    key={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}`}
                                    style={StateStyle}
                                    onEachFeature={StateOnEachfeature}

                                    // style={{
                                    //     fillColor: "black",
                                    //     weight: selectedAdminBoundaries.value === "SubDistrict_Boundary" ? 0.8 : 2,
                                    //     color: "black",
                                    //     fillOpacity: "0.001",
                                    //     interactive: false,
                                    // }}
                                    data={geojsonJsonData.features}
                                />

                            </>


                        ) : null}


                    </>
                )}



                {selectedDataQuery && selectedData && geojsonJsonData && selectedDataQuery.DataValue === "hydrometeorological_disasters" && selectedVariable && selectedAdminBoundaries !== "" && (
                    <>

                        <div className="legend_panel_container" style={{ width: "320px", bottom: "60px", padding: "5px", right: "10px", backgroundColor: "white", borderRadius: "5px" }}>
                            <div className="item-heading" >
                                <p style={{ fontSize: "14px" }}>{selectedVariable.legendTitel}</p>
                            </div>
                            <Image src={selectedVariable.legendImg} alt='Legend' />
                        </div>


                        {selectedAdminBoundaries === "District" ? (
                            <>
                                <GeoJSON
                                    key={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}`}
                                    style={DistrictHydrometeorologicalStyle}
                                    data={geojsonJsonData.features}
                                    onEachFeature={DistrictOnEachfeature}
                                />
                            </>


                        ) : selectedAdminBoundaries === "State" ? (
                            <>
                                {/* <GeoJSON
                                    key={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}`}
                                    style={StateStyle}
                                    onEachFeature={StateOnEachfeature}
                                    data={IndiaStates.features}
                                /> */}

                            </>


                        ) : null}


                    </>
                )}

            </MapContainer>
        </>
    )
}

export default VisualizeRiskMap