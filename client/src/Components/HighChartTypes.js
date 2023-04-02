import React from 'react'
const GRAPH_TYPES = [
    { name: 'Bar (Horizontal)', value: 'bar'}, 
    { name: 'Column (Vertical)', value: 'column'}, 
    { name: 'Spline (Curved)', value: 'spline'}, 
    { name: 'Area (Underarea)', value: 'area'}, 
    { name: 'Line (Straight)', value: 'line'}, 
    { name: 'Scatter', value: 'scatter'}, 
    { name: 'Pie', value: 'pie'}, 
];

function HighChartTypes({ selected, refAnchor }) {
    return (
        <select className='form-control text-center' id='graphType' ref={refAnchor}>
            <option value="">Graph Type</option>
            {GRAPH_TYPES.map(({ name, value }) => <option value={value} selected={selected && value === selected}>{name}</option>)}
        </select>
    )
}

export default HighChartTypes;