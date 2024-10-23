import React, { useRef, useState } from 'react'
import PlaceAttributes from "../../public/data/PlaceAttributes.json"
import dynamic from 'next/dynamic';
import MapLoader from '@/components/MapLoader';
import Head from 'next/head';

const DecesionSupportMap = dynamic(() => import('../components/maps/DecesionSupportMap'), {
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

            },
            {
                name: "Drought pentad",
                value: "drought_pentad_occurrence",

            },
            {
                name: "Cyclone pentad",
                value: "cyclone_pentad_occurrence",

            },

        ]
    },
]

const DecisionSupportPage = () => {

    const [selectedDataQuery1, setSelectedDataQuery1] = useState(null);
    const [selectedDataQuery2, setSelectedDataQuery2] = useState(null);
    const [selectedDataQuery3, setSelectedDataQuery3] = useState(null);
    const [selectedDataQuery4, setSelectedDataQuery4] = useState(null);
    const [selectedVariable1, setSelectedVariable1] = useState("");
    const [selectedVariable2, setSelectedVariable2] = useState("");
    const [selectedVariable3, setSelectedVariable3] = useState("");
    const [selectedVariable4, setSelectedVariable4] = useState("");


    const [districtList, setDistrictList] = useState([]);
    const [talukaList, setTalukaList] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedTehsil, setSelectedTehsil] = useState("");




    const handleStateSelect = (event, value) => {
        let items = PlaceAttributes.filter((item) => item.STATE === value);
        items = [...new Set(items.map((item) => item))];
        items.sort();

        setDistrictList(items);
        setSelectedState(value)

        // let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.STATE === value);

        // setFilteredIndiaDistrict({
        //     type: "FeatureCollection",
        //     features: filteredFeatures,
        // });

    };

    const handleDistrictSelect = (event, value) => {

        let items = PlaceAttributes.filter((item) => item.DISTRICT === value && item.STATE === selectedState);
        items = [...new Set(items.map((item) => item))];
        items.sort();

        setTalukaList(items);
        setSelectedDistrict(value)

        // let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.DISTRICT === value && feature.properties.STATE === selectedState);

        // setFilteredIndiaDistrict({
        //     type: "FeatureCollection",
        //     features: filteredFeatures,
        // });

    };

    // const handleTalukaSelect = (event, value) => {

    //     let items = PlaceAttributes.filter((item) => item.TEHSIL === value && item.DISTRICT === selectedDistrict);
    //     items = [...new Set(items.map((item) => item))];
    //     items.sort();
    //     setSelectedTehsil(value)
    //     let filteredFeatures = IndiaTehsils.features.filter((feature) => feature.properties.TEHSIL === value && feature.properties.DISTRICT === selectedDistrict);

    //     setFilteredIndiaDistrict({
    //         type: "FeatureCollection",
    //         features: filteredFeatures,
    //     });


    // };







    return (
        <>
            <Head>
                <meta name="description" content="India Climate Resilience Atlas" />
                <title>Map Comparison | CRAI</title>
            </Head>

            <div className='dasboard_page_container'>


                <div className='main_dashboard'>
                    <div className='left_panel'>

                        <div className="card_container" style={{ height: "100%", overflowY: "auto" }}>

                            <div className="accordion" >
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Map-1
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                                        <div className="accordion-body">
                                            <div className='map_layers'>
                                                <label>Select dataset</label>
                                                <select className="form-select mb-2"
                                                    value={selectedDataQuery1 ? selectedDataQuery1.DataValue : ""}

                                                    onChange={(e) => {
                                                        const selectedDataValue = e.target.value;
                                                        const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                                                        setSelectedDataQuery1(selectedData);
                                                        setSelectedVariable1(null)
                                                    }}>
                                                    <option value="">Select</option>
                                                    {MapDatasetOptions.map((item, index) => (
                                                        <option key={index} value={item.DataValue}>{item.DataName}</option>
                                                    ))}
                                                </select>


                                                <label>Select variable</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedVariable1 ? selectedVariable1.value : ""}
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery1.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable1(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery1}
                                                >
                                                    <option value="">Select Variable</option>
                                                    {selectedDataQuery1 && selectedDataQuery1.variables.map((variable, index) => (
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
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Map-2
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                                        <div className="accordion-body">
                                            <div className='map_layers'>
                                                <label>Select dataset</label>
                                                <select className="form-select mb-2"
                                                    value={selectedDataQuery2 ? selectedDataQuery2.DataValue : ""}
                                                    onChange={(e) => {
                                                        const selectedDataValue = e.target.value;
                                                        const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                                                        setSelectedDataQuery2(selectedData);
                                                        setSelectedVariable2(null)
                                                    }}>
                                                    <option value="">Select</option>
                                                    {MapDatasetOptions.map((item, index) => (
                                                        <option key={index} value={item.DataValue}>{item.DataName}</option>
                                                    ))}
                                                </select>


                                                <label>Select variable</label>
                                                <select
                                                    value={selectedVariable2 ? selectedVariable2.value : ""}
                                                    className="form-select"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery2.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable2(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery2}
                                                >
                                                    <option value="">Select Variable</option>
                                                    {selectedDataQuery2 && selectedDataQuery2.variables.map((variable, index) => (
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
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Map-3
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                                        <div className="accordion-body">
                                            <div className='map_layers'>
                                                <label>Select dataset</label>
                                                <select className="form-select mb-2"
                                                    value={selectedDataQuery3 ? selectedDataQuery3.DataValue : ""}

                                                    onChange={(e) => {
                                                        const selectedDataValue = e.target.value;
                                                        const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                                                        setSelectedDataQuery3(selectedData);
                                                        setSelectedVariable3(null)
                                                    }}>
                                                    <option value="">Select</option>
                                                    {MapDatasetOptions.map((item, index) => (
                                                        <option key={index} value={item.DataValue}>{item.DataName}</option>
                                                    ))}
                                                </select>


                                                <label>Select variable</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedVariable3 ? selectedVariable3.value : ""}
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery3.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable3(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery3}
                                                >
                                                    <option value="">Select Variable</option>
                                                    {selectedDataQuery3 && selectedDataQuery3.variables.map((variable, index) => (
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
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Map-4
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">

                                        <div className="accordion-body">
                                            <div className='map_layers'>
                                                <label>Select dataset</label>
                                                <select className="form-select mb-2"
                                                    value={selectedDataQuery4 ? selectedDataQuery4.DataValue : ""}
                                                    onChange={(e) => {
                                                        const selectedDataValue = e.target.value;
                                                        const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
                                                        setSelectedDataQuery4(selectedData);
                                                        setSelectedVariable4(null)
                                                    }}>
                                                    <option value="">Select</option>
                                                    {MapDatasetOptions.map((item, index) => (
                                                        <option key={index} value={item.DataValue}>{item.DataName}</option>
                                                    ))}
                                                </select>


                                                <label>Select variable</label>
                                                <select
                                                    value={selectedVariable4 ? selectedVariable4.value : ""}
                                                    className="form-select"
                                                    onChange={(event) => {
                                                        const selectedOptionValue = event.target.value;
                                                        const selectedOption = selectedDataQuery4.variables.find(variable => variable.value === selectedOptionValue);
                                                        setSelectedVariable4(selectedOption);
                                                    }}
                                                    disabled={!selectedDataQuery4}
                                                >
                                                    <option value="">Select Variable</option>
                                                    {selectedDataQuery4 && selectedDataQuery4.variables.map((variable, index) => (
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
                                    <h2 className="accordion-header" id="panelsStayOpen-heading3">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse3" aria-expanded="true" aria-controls="panelsStayOpen-collapse3">
                                            Select administrative units
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapse3" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading3">

                                        <div className="accordion-body">
                                            <div className='map_layers'>

                                                <label>Select State</label>
                                                <select
                                                    className="form-select mb-3"
                                                    value={selectedState}
                                                    onChange={(event) => handleStateSelect(event, event.target.value)}
                                                    disabled={!selectedVariable1}
                                                >
                                                    <option value="">Select State</option>

                                                    {PlaceAttributes &&
                                                        [...new Set(PlaceAttributes.map(item => item.STATE))].sort().map((state, index) => (
                                                            <option key={index} value={state}>{state}</option>
                                                        ))}
                                                </select>

                                                <label >Select District</label>
                                                <select
                                                    value={selectedDistrict}
                                                    className="form-select mb-3"
                                                    onChange={(event) => handleDistrictSelect(event, event.target.value)}
                                                    disabled={districtList.length === 0}
                                                >
                                                    <option value="">Select District</option>

                                                    {districtList.length > 0 &&
                                                        [...new Set(districtList.map(item => item.DISTRICT))].sort().map((district, index) => (
                                                            <option key={index} value={district}>{district}</option>
                                                        ))}
                                                </select>

                                                {/* <label>Select Tehsil</label>
                                                <select
                                                    className="form-select mb-3"
                                                    onChange={(event) => handleTalukaSelect(event, event.target.value)}
                                                    disabled={talukaList.length === 0}
                                                >
                                                    <option selected>Select Tehsil</option>

                                                    {talukaList.length > 0 &&
                                                        [...new Set(talukaList.map(item => item.TEHSIL))].sort().map((taluka, index) => (
                                                            <option key={index} value={taluka}>{taluka}</option>
                                                        ))}
                                                </select> */}



                                            </div>

                                        </div>



                                    </div>
                                </div>





                            </div>


                        </div>


                    </div>

                    <div className='decision_maps_container'>

                        <div className='decision_maps'>

                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery1}
                                // filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable1}
                                // uploadeddata={uploadeddata}
                                mapNumber="Map-1"
                            />
                        </div>

                        <div className='decision_maps'>
                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery2}
                                // filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable2}
                                // uploadeddata={uploadeddata}
                                mapNumber="Map-2"
                            />
                        </div>

                        <div className='decision_maps'>
                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery3}
                                // filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable3}
                                // uploadeddata={uploadeddata}
                                mapNumber="Map-3"
                            />
                        </div>

                        <div className='decision_maps'>

                            <DecesionSupportMap
                                selectedState={selectedState}
                                selectedDistrict={selectedDistrict}
                                selectedTehsil={selectedTehsil}
                                selectedDataQuery={selectedDataQuery4}
                                // filteredIndiaDistrict={filteredIndiaDistrict}
                                selectedVariable={selectedVariable4}
                                // uploadeddata={uploadeddata}
                                mapNumber="Map-4"
                            />
                        </div>


                    </div>

                </div>
            </div>

        </>
    )
}

export default DecisionSupportPage
