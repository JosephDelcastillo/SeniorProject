import React from 'react'
import { v4 as uuid } from 'uuid'

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
            {GRAPH_TYPES.map(({ name, value }) => <option key={uuid()} value={value} selected={selected && value === selected}>{name}</option>)}
        </select>
    )
}

export default HighChartTypes;