import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import MapLoader from '@/components/MapLoader';

import { ColorLegendsData } from '../../public/data/ColorLegendsData';
import { FiExternalLink } from "react-icons/fi";

const AdaptationToolChart = dynamic(() => import('@/components/charts/AdaptationToolChart'), {
    ssr: false,
    loading: () => <MapLoader />
});


const AdaptationToolMap = dynamic(() => import('@/components/maps/AdaptationToolMap'), {
    ssr: false,
    loading: () => <MapLoader />
});

const MapDatasetOptions = [
    {
        Sector: "Agriculture",
        States: ["Maharashtra"],
        Components: [
            {
                name: "Historical hazard index",
                value: "historical_hazard",
            },
            {
                name: "Current hazard index",
                value: "hazard",
            },
            {
                name: "Exposure index",
                value: "exposure",
            },
            {
                name: "Vulnerability index",
                value: "vulnerability",
            },
            {
                name: "Risk index",
                value: "risk",

            },
        ]
    },
    {
        Sector: "Health",
        States: [],
        Components: []
    },
    {
        Sector: "Water",
        States: ["Maharashtra", "Punjab"],
        Components: [
            {
                name: "Hazard",
                value: "hazard",
            },
            {
                name: "Exposure",
                value: "exposure",

            },
            {
                name: "Vulnerability",
                value: "vulnerability",
            },
            {
                name: "Risk",
                value: "risk",
            },
        ]

    },
    {
        Sector: "Industries",
        States: [],
        Components: ["Hazard", "Exposure", "Vulnerability", "Risk"]
    },
    {
        Sector: "Energy",
        States: [],
        Components: ["Hazard", "Exposure", "Vulnerability", "Risk"]
    },
];

const ClimateRiskAndAdaptation = () => {
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTimeseries, setShowTimeseries] = useState(false);
    const [geojsonJsonData, setGeojsonJsonData] = useState(null);
    const [selectedData, setSelectedData] = useState(null)




    useEffect(() => {
        if (selectedSector && selectedSector.Sector && selectedState && selectedComponent) {
            const fetchData = async () => {
                try {
                    setLoading(true);

                    const queryString = new URLSearchParams({
                        Sector: selectedSector.Sector,
                        State: selectedState,
                    }).toString();

                    const response = await fetch(`/api/climateRiskAdaptation?${queryString}`);
                    const geojsonresponse = await import(`../../public/data/Admin_Boundary/IndiaDistricts_2011.json`);

                    const filteredJson = geojsonresponse.default.features.filter((item) => item.properties.STATE === selectedState);

                    setGeojsonJsonData(filteredJson);


                    // Assuming you want to set JSON response to state after fetching
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
    }, [selectedState, selectedSector, selectedComponent]);



    const ColorLegendsDataItem = selectedComponent && ColorLegendsData[`${selectedComponent.value}_palette`];


    const handleSelectSector = (e) => {
        const selectedValue = e.target.value;
        const selectedData = MapDatasetOptions.find(item => item.Sector === selectedValue);
        setSelectedSector(selectedData);
        setSelectedData(null)
        setSelectedState(null);  // Reset state when changing sectors
        setSelectedComponent(null);  // Reset component when changing sectors
    };

    const handleSelectState = (e) => {
        
        setSelectedState(e.target.value);
    };

    const handleSelectComponent = (e) => {
        const selectedValue = e.target.value;
        const selectedData = selectedSector.Components.find(item => item.value === selectedValue);
        setSelectedComponent(selectedData);
        setShowTimeseries(true)

    };
    const handleShowTimeseries = () => {
        setShowTimeseries(!showTimeseries)
    }


    return (
        <>
            <Head>
                <meta name="description" content="India Climate Resilience Atlas" />
                <title>Climate risk and adaptation | CRAI</title>
            </Head>

            <div className='dasboard_page_container'>
                <div className='main_dashboard'>
                    <div className='left_panel'>
                        <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>
                            <div className="accordion" >
                                {/* Select Sector */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingSector">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSector" aria-expanded="true" aria-controls="panelsStayOpen-collapseSector">
                                            Select Sector
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseSector" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSector">
                                        <div className="accordion-body">
                                            <select className="form-select mb-3" value={selectedSector ? selectedSector.Sector : ''} onChange={handleSelectSector}>
                                                <option value="">Select</option>
                                                {MapDatasetOptions.map((item, index) => <option key={index} value={item.Sector}>{item.Sector}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Select State */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingState">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseState" aria-expanded="true" aria-controls="panelsStayOpen-collapseState">
                                            Select State
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseState" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingState">
                                        <div className="accordion-body">
                                            <select className="form-select mb-3" value={selectedState || ''} onChange={handleSelectState} disabled={!selectedSector || !selectedSector.States.length}>
                                                <option value="">Select</option>
                                                {selectedSector && selectedSector.States.map((state, index) => <option key={index} value={state}>{state}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Select Component */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingComponent">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseComponent" aria-expanded="true" aria-controls="panelsStayOpen-collapseComponent">
                                            Select Component
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseComponent" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingComponent">
                                        <div className="accordion-body">
                                            <select className="form-select mb-3" 
                                            value={selectedComponent ? selectedComponent.value : ''}
                                            onChange={handleSelectComponent} 
                                            disabled={!selectedState}>
                                                <option value="">Select</option>
                                                {selectedSector && selectedSector.Components.map((variable, index) => <option key={index} value={variable.value}>{variable.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='panel_button'>
                                <button type='button'
                                    disabled={!selectedComponent}
                                    onClick={handleShowTimeseries}>
                                    {showTimeseries ? "Hide Chart" : "Show Chart"}
                                </button>
                            </div>


                            <div className='panel_button'>
                                <a href='https://docs.google.com/spreadsheets/d/1g02dkeqinPZGes4dYjNT0ZvsegK8w6T-KD-W6RYX2KI/edit'
                                target='_blank'>

                                <button type='button' >
                                    Explore adaptation strategies <FiExternalLink />
                                </button>
                                </a>
                            </div>




                        </div>
                    </div>

                    <div className='right_panel'>
                        <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>
                            <AdaptationToolMap
                                setLoading={setLoading}
                                selectedSector={selectedSector}
                                selectedState={selectedState}
                                selectedComponent={selectedComponent}
                                selectedData={selectedData}
                                geojsonJsonData={geojsonJsonData}
                                ColorLegendsDataItem={ColorLegendsDataItem}
                            />

                            {showTimeseries && selectedData  && (
                                <div className='time_series_container'>
                                    <AdaptationToolChart
                                        handleShowTimeseries={handleShowTimeseries}
                                        title={`${selectedState} - ${selectedSector.Sector} - ${selectedComponent.name}`}
                                        selectedData={selectedData}
                                        selectedComponent={selectedComponent}
                                        ColorLegendsDataItem={ColorLegendsDataItem}
                                    />

                                </div>


                            )}

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
            </div>
        </>
    );
}

export default ClimateRiskAndAdaptation;
