import React, { useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { mapCenter, setInitialMapZoom } from '../helpers/mapFunction';


const FiltererdJsonData = ({
    selectedState,
    selectedDistrict,
    selectedTehsil,
    filteredIndiaDistrict,
    TalukaOnEachfeature,
    filteredDataStyle
}) => {
    const map = useMap();




    useEffect(() => {
        if (filteredIndiaDistrict && filteredIndiaDistrict.features.length > 0) {
            const bounds = filteredIndiaDistrict.features.reduce((acc, feature) => {
                const featureBounds = L.geoJSON(feature.geometry).getBounds();
                return acc.extend(featureBounds);
            }, new L.LatLngBounds());

            map.flyToBounds(bounds);
        } else {
            map.flyTo(mapCenter, setInitialMapZoom());
        }
    }, [filteredIndiaDistrict, map]);


    return (
        <>
            {filteredIndiaDistrict && filteredIndiaDistrict.features && (

            <GeoJSON
                key={selectedState+selectedDistrict+selectedTehsil}
                data={filteredIndiaDistrict.features}
                // style={{ fillColor: 'none', weight: 2, color: 'yellow' }}
                style={filteredDataStyle}
                onEachFeature={TalukaOnEachfeature}
            />
            
            )}
        </>

    );
};

export default FiltererdJsonData;
