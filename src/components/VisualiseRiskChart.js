import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { IoMdClose } from "react-icons/io";

const VisualiseRiskChart = ({ selectedFeature, handleShowTimeseries, selectedData }) => {

    const filteredData = selectedData.find((item) => item[selectedFeature.featureType] === selectedFeature.featureName);
console.log(filteredData)

    // const getColor = (value, thresholds, colors) => {
    //     for (let i = 0; i < thresholds.length; i++) {
    //         if (value > thresholds[i]) {
    //             return colors[i];
    //         }
    //     }
    //     return colors[colors.length - 1]; 
    // };



    return (
        <div className='' style={{ height: "100%" }}>
            <div className='timeseries_heading'>
                <h4>
                    {selectedFeature.featureType} - {selectedFeature.featureName}<br />
                </h4>
                <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
            </div>

            {filteredData && (

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
                        // plotOptions: {
                        //     bar: {
                        //         distributed: true
                        //     }
                        // },
                        // colors: colors,
                        legend: {
                            show: false // This hides the legend
                        },

                        yaxis: {
                            title: {
                                text: "Changes in monsoon data",
                            },
                        },

                    }}
                    series={[
                        {
                            name: "Changes in monsoon data",
                            data: [filteredData.jjas_percent_anomaly_mean,filteredData.ond_panomaly_mean, filteredData.june_panomaly_mean, filteredData.july_panomaly_mean, filteredData.august_panomaly_mean, filteredData.september_panomaly_mean,
                             filteredData.october_panomaly_mean, filteredData.november_panomaly_mean, filteredData.december_panomaly_mean,
                            
                            ]
                        }
                    ]}
                    type="bar"
                    style={{ height: "100%", width: "100%" }}
                    height="70%"
                />

            )}


        </div>
    );
};

export default VisualiseRiskChart;
