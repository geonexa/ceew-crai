import React, { useEffect, useState } from 'react'
import { TileLayer, GeoJSON, LayersControl, FeatureGroup, ScaleControl, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import { FaHome } from "react-icons/fa";






const BaseMap = () => {
    const [mousePosition, setMousePosition] = useState({ lat: 0, lng: 0 });
    const map = useMap();

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




    const HandleMouseHover = () => {
        useMapEvents({
            mousemove: (e) => {
                setMousePosition(e.latlng);
            },
        });
        return null;
    };



    const handleZoomToCenter = () => {
        map.setView(mapCenter, setInitialMapZoom());

    };




    return (
        <>

            <HandleMouseHover />

            <div
                className='coordinates_container' >
                Lat: {mousePosition.lat.toFixed(4)}, Long:{" "}
                {mousePosition.lng.toFixed(4)}
            </div>
            <button className='map_home_btn' title='Reset Zoom' onClick={handleZoomToCenter}><FaHome /></button>
            <ScaleControl />




        </>
    )
}

export default BaseMap