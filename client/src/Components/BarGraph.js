import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BarGraph({ columns, data, xKey }) {
    return (
        <ResponsiveContainer width={"100%"} aspect={1}>
            <BarChart width={999} height={999} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {(Array.isArray(columns)) ? (
                    columns.map(({id, color}) => <Bar dataKey={id} fill={color} />)
                ) : (<></>)}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarGraph