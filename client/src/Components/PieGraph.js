import React from 'react';
import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer } from 'recharts';

function PieGraph({ columns, data, target, xKey }) {
    data.forEach(element => {
        element.name = element.name || element[xKey];
        element[target] = parseInt(element[target]);
    });
    console.log(data)

    return (
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
            <PieChart width={999} height={999}>
                <Pie data={data} dataKey={target} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default PieGraph