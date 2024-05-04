import React from 'react'
const MapLegend = ({legendName}) => {
    return (
        <>

                <div className="legend">
                    <div className="item-heading">
                        <p>Legend: {legendName} (%)</p>
                    </div>
                    {/* <div className="legend-item">
                        <p className="legend-color-value"> Exceptional</p>
                        <p className="legend-color-value"> Extreme</p>
                        <p className="legend-color-value"> Severe</p>
                        <p className="legend-color-value"> Moderate</p>
                        <p className="legend-color-value"> Abnormal</p>
                        <p className="legend-color-value"> Normal</p>
                    </div> */}
                    <div className="legend-color">

                        <i style={{backgroundColor: '#68001F'}}></i>
                        <i style={{backgroundColor: '#C13739'}}></i>
                        <i style={{backgroundColor: '#F09C7A'}}></i>
                        <i style={{backgroundColor: '#FBE3D6'}}></i>
                        <i style={{backgroundColor: '#DDEBF2'}}></i>
                        <i style={{backgroundColor: '#87BEDA'}}></i>
                        <i style={{backgroundColor: '#2F7AB6'}}></i>
                        <i style={{backgroundColor: '#053062'}}></i>
                    </div>

                    <div className="legend-item">
                        <p className="legend-num-value"> </p>
                        <p className="legend-num-value"> -30</p>
                        <p className="legend-num-value"> -20</p>
                        <p className="legend-num-value"> -10</p>
                        <p className="legend-num-value"> 0</p>
                        <p className="legend-num-value"> 10</p>
                        <p className="legend-num-value"> 20</p>
                        <p className="legend-num-value"> 30</p>
  
                    </div>

                </div>

        </>

    )
}

export default MapLegend