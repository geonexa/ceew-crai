import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { IoMdClose } from "react-icons/io";

const VisualiseRiskChart = ({ selectedFeature, handleShowTimeseries, selectedData, selectedDataQuery }) => {


    let filteredData;
    if (selectedData && selectedFeature && selectedFeature.featureType && selectedDataQuery && selectedDataQuery.DataValue == "MonsoonData") {
        filteredData = selectedData.find((item) => item[selectedFeature.featureType] === selectedFeature.featureName);
    }



    return (
        <div className='' style={{ height: "100%" }}>
            {selectedFeature && filteredData ? (
                <>
                    <div className='timeseries_heading'>
                        <h4>
                        Monsoon variability ({selectedFeature.featureType} - {selectedFeature.featureName})<br />
                        </h4>
                        <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
                    </div>


                    <ReactApexChart
                        options={{
                            chart: {
                                id: 'apexchart-example'
                            },
                            xaxis: {
                                categories: ["JJAS", "OND", "June", "July", "August", "September",
                                    "October", "November", "December"
                                ]
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            legend: {
                                show: false // This hides the legend
                            },
                            yaxis: {

                                title: {
                                    text: `Monsoon variability`,
                                    style: {
                                        fontSize: '12px'
                                    }
                                },
                            },
                            grid: {
                                padding: {
                                    left: 20, // Adjust left padding to make space for the y-axis title
                                }
                            }
                        }}
                        series={[
                            {
                                name: "Changes in last decade (2012-2022) compared to climate baseline (1982-2011) (in %)",
                                data: [filteredData.jjas_percent_anomaly_mean, filteredData.ond_panomaly_mean, filteredData.june_panomaly_mean, filteredData.july_panomaly_mean, filteredData.august_panomaly_mean, filteredData.september_panomaly_mean,
                                filteredData.october_panomaly_mean, filteredData.november_panomaly_mean, filteredData.december_panomaly_mean,
                                ]
                            }
                        ]}
                        type="bar"
                        height="70%"
                    />

                </>

            ) : (
                <>
                    <div className='timeseries_heading'>

                        <p>Please select a feature.</p>

                        <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>

                    </div>

                </>

            )}

        </div>
    );
};

export default VisualiseRiskChart;
