
import React, { useEffect, useState } from 'react'
import SearchBar from "../SearchBar";
import { MapContainer, GeoJSON, TileLayer, ImageOverlay, Marker, Tooltip, Circle } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import BaseMap from '../Basemap';
import Image from 'next/image';
import IndiaClimateZones from "../../../public/images/IndiaClimateZones_1991_2020.png"
import climate_zones_legend from "../../../public/images/climate_zones_legend.jpg"
import { FaChartBar } from "react-icons/fa";
import IndiaBoundary from '../../../public/data/shapefiles/IndiaBoundary.json';
import marker_icon from "../../../public/images/marker_icon.png"


import ExportMapButton from '../ExportMapButton';
import { BaseMapsLayers } from '@/helpers/mapFunction';
import { fillDensityColor } from '@/helpers/functions';
import FiltererdGeojsonData from '../FiltererdGeojsonData';

const VisualizeRiskMap = ({ selectedThematicLayers, uploadeddata, handleShowTimeseries, setShowTimeseries, setSelectedFeature, selectedRasterLayer, ColorLegendsDataItem, selectedDataQuery, selectedVariable, selectedAdminBoundaries, rasterLayerOpacity, mapContainerRef, selectedData, geojsonJsonData }) => {
    const [loading, setLoading] = useState(false);
    const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);
    const [thematicLayerData, setThematicLayerData] = useState({});





    useEffect(() => {
        const fetchData = async (layer) => {
            try {
                setLoading(true);
                const geojsonresponse = await import(`../../../public/data/shapefiles/${layer.LayerData}`);
                setThematicLayerData(prevState => ({
                    ...prevState,
                    [layer.value]: geojsonresponse.default,
                }));
            } catch (error) {
                console.error('Error loading the data:', error);
            } finally {
                setLoading(false);
            }
        };

        selectedThematicLayers.forEach(layer => {
            if (!thematicLayerData[layer.value]) {
                fetchData(layer);
            }
        });
    }, [selectedThematicLayers, thematicLayerData]);




    const handleBasemapSelection = (e) => {
        const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
        setSelectedBasemapLayer(selectedItem);


    };


    function TalukaOnEachfeature(feature, layer) {

        // layer.on('click', function (e) {
        //     setSelectedFeature({
        //         featureType: "TEHSIL",
        //         featureName: feature.properties["TEHSIL"]
        //     })
        //     setShowTimeseries(true)
        // });



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

        // layer.on('click', function (e) {
        //     setSelectedFeature({
        //         featureType: "DISTRICT",
        //         featureName: feature.properties["DISTRICT"]
        //     })
        //     setShowTimeseries(true)
        // })

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
        // layer.on('click', function (e) {
        //     setSelectedFeature({
        //         featureType: "STATE",
        //         featureName: feature.properties["STATE"]
        //     })
        //     setShowTimeseries(true)
        // });



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


    const DistrictStyle = (feature => {
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
                <button className='show_chart_btn' title='Show Chart' onClick={handleShowTimeseries}><FaChartBar /></button>


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




                {selectedThematicLayers.map(layer => (
                    <React.Fragment key={layer.value}>
                        {layer.value === "river_network" && thematicLayerData[layer.value] && thematicLayerData[layer.value].type === "FeatureCollection" && (
                            <GeoJSON
                                data={thematicLayerData[layer.value]}
                                style={{
                                    fillColor: 'blue', weight: 1, color: 'blue', fillOpacity: 0.4,
                                    interactive: false,
                                }}
                            />
                        )}
                        {layer.value === "solar_projects" && thematicLayerData[layer.value] && Array.isArray(thematicLayerData[layer.value]) && (
                            <>
                                {thematicLayerData[layer.value].map((project) => (
                                    <Circle
                                        key={project['Project ID']}
                                        center={[project.Lat, project.Long]}
                                        // radius={project['AC Capacity(MW)'] * 200}
                                        radius={1000}
                                        color="orange"
                                        fillOpacity={0.8}
                                    >
                                        <Tooltip>
                                            <div>
                                                Project: <strong>{project['Project Name']}</strong><br />
                                                Owner: {project['Owner Name']}<br />
                                                Capacity: {project['AC Capacity(MW)']} MW<br />
                                                State: {project['State']}
                                            </div>
                                        </Tooltip>
                                    </Circle>
                                ))}
                            </>
                        )}
                    </React.Fragment>
                ))}








                {uploadeddata && uploadeddata.type === "FeatureCollection" ? (
                    renderGeoJSON()
                ) : (
                    renderMarkers()

                )}




                {selectedDataQuery && geojsonJsonData && selectedData && selectedDataQuery.DataValue === "MonsoonData" && selectedVariable && selectedAdminBoundaries !== "" && (
                    <>


                        <div className="legend_panel_container" style={{ width: "400px", bottom: "60px", padding: "5px", right: "10px", backgroundColor: "white", borderRadius: "5px" }}>
                            <div className="item-heading" >
                                <p style={{ fontSize: "14px" }}>{selectedVariable.legendTitel}</p>
                            </div>
                            <Image src={selectedVariable.legendImg} alt='Legend' />
                        </div>



                        {selectedAdminBoundaries === "Tehsil" ? (
                            <>
                                <FiltererdGeojsonData
                                    datakey={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}+ ${geojsonJsonData && geojsonJsonData.features.length}`}
                                    filteredData={geojsonJsonData.features}
                                    filteredDataOnEachfeature={TalukaOnEachfeature}
                                    filteredDataStyle={TalukaStyle}

                                />

                            </>


                        ) : selectedAdminBoundaries === "District" ? (
                            <>

                                <FiltererdGeojsonData
                                    datakey={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}+ ${geojsonJsonData && geojsonJsonData.features.length}`}
                                    filteredData={geojsonJsonData.features}
                                    filteredDataOnEachfeature={DistrictOnEachfeature}
                                    filteredDataStyle={DistrictStyle}

                                />



                            </>


                        ) : selectedAdminBoundaries === "State" ? (
                            <>

                                <FiltererdGeojsonData
                                    datakey={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}+ ${geojsonJsonData && geojsonJsonData.features.length}`}
                                    filteredData={geojsonJsonData.features}
                                    filteredDataOnEachfeature={StateOnEachfeature}
                                    filteredDataStyle={StateStyle}

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

                                <FiltererdGeojsonData
                                    datakey={`${selectedAdminBoundaries} + ${selectedVariable.value} + ${selectedData && selectedData.length}+ ${geojsonJsonData && geojsonJsonData.features.length}`}
                                    filteredData={geojsonJsonData.features}
                                    filteredDataOnEachfeature={DistrictOnEachfeature}
                                    filteredDataStyle={DistrictHydrometeorologicalStyle}

                                />


                            </>


                        ) : null}


                    </>
                )}

                {loading && (
                    <div className='map_layer_loader_container_desktop' style={{ width: "80vw" }}>
                        <div className="map_loader_container">
                            <span className="map_loader"></span>
                        </div>

                    </div>

                )}

            </MapContainer>



        </>
    )
}

export default VisualizeRiskMap