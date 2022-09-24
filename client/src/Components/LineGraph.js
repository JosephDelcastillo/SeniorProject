import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LineGraph({ columns, data, xKey }) {
    console.log(data)
    return (
        <ResponsiveContainer width={"100%"} aspect={1}>
            <LineChart width={999} height={999} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {(Array.isArray(columns)) ? (
                    columns.map(({id, color}) => <Line dataKey={id} fill={color} />)
                ) : (<></>)}
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineGraph