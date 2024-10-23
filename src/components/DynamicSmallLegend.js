import React from 'react';

const DynamicSmallLegend = ({ ColorLegendsDataItem }) => {


    const { Title, Colors, Labels } = ColorLegendsDataItem;

    const reversedColors = [...Colors].reverse();
    const reversedLabels = [...Labels].reverse();


    return (

        <div className="legend_panel_container" style={{ width: "140px", bottom: "5px", padding: "5px", right: "5px", backgroundColor: "whitesmoke", borderRadius: "5px" }}>

            <p style={{ fontSize: "12px", textAlign: "lett" }}>{Title}</p>

            <div className="legend-color-container">
                {reversedColors.map((color, index) => (
                    <div key={index} className="legend_item">
                        <span
                            className="legend_item_square"
                            style={{ backgroundColor: color }}
                        />
                        <span className="legend-label">
                            {reversedLabels[index]}
                        </span>
                    </div>
                ))}
            </div>
        </div>




    );
};

export default DynamicSmallLegend;
