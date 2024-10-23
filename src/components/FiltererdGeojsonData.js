import React, { useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import * as L from 'leaflet';


const FiltererdGeojsonData = ({
    datakey,
    filteredData,
    filteredDataOnEachfeature,
    filteredDataStyle
}) => {
    const map = useMap();



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

    useEffect(() => {
        if (filteredData && filteredData.length > 0) {
            const bounds = filteredData.reduce((acc, feature) => {
                const featureBounds = L.geoJSON(feature.geometry).getBounds();
                return acc.extend(featureBounds);
            }, new L.LatLngBounds());

            map.flyToBounds(bounds);
        } else {
            map.flyTo(mapCenter, setInitialMapZoom());
        }
    }, [filteredData, map]);



    return (
        <>
            {filteredData && filteredData.length>0 && (

            <GeoJSON
                key={datakey}
                data={filteredData}
                style={filteredDataStyle}
                onEachFeature={filteredDataOnEachfeature}
            />
            
            )}
        </>

    );
};

export default FiltererdGeojsonData;
