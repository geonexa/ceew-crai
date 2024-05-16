import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { IoMdClose } from "react-icons/io";

const AdaptationToolChart = ({ handleShowTimeseries, title, selectedData, selectedComponent,ColorLegendsDataItem }) => {


    const getColor = (value, thresholds, colors) => {
        for (let i = 0; i < thresholds.length; i++) {
            if (value > thresholds[i]) {
                return colors[i];
            }
        }
        return colors[colors.length - 1]; 
    };
    
    const colors = selectedData.map(value => {
        return getColor(value[selectedComponent.value], ColorLegendsDataItem.Value, ColorLegendsDataItem.Colors);
    });

    return (
        <div className='' style={{ height: "100%" }}>
            <div className='timeseries_heading'>
                <h4>
                    {title}<br />
                </h4>
                <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
            </div>

            <ReactApexChart
                options={{
                    chart: {
                        id: 'apexchart-example'
                    },
                    xaxis: {
                        categories: selectedData.map(item => item.DISTRICT) // Corrected map usage
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    plotOptions: {
                        bar: {
                            distributed: true
                        }
                    },
                    legend: {
                        show: false // This hides the legend
                    },
                    colors: colors,
                    yaxis: {
                        title: {
                            text: selectedComponent.name,
                        },
                        // reversed: true
                    },

                }}
                series={[
                    {
                        name: selectedComponent.name, // Assuming `selectedComponent` has label
                        data: selectedData.map(item => item[selectedComponent.value]) // Corrected map usage
                    }
                ]}
                type="bar"
                style={{ height: "100%", width: "100%" }}
                height="70%"
            />
        </div>
    );
};

export default AdaptationToolChart;
