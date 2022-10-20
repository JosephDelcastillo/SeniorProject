import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

function HighChart({ data, title, yAxis, type }) {
    const chart = useRef();
    
    const MAX = 100;
    const MIN = 10;
    const RANGE = (MAX - MIN);
    const STEPS = data.length + 1; 
    const GAP = RANGE / STEPS;
    const CUR = (count) => MAX - (GAP * count);
    const INNER = (count) => MAX - (GAP * (count + 1));

    data.forEach((element, count) => {
        element.size = `${CUR(count)}%`;
        element.innerSize = `${INNER(count)}%`;
    });
    const options = {
        chart: {
            type: type ?? 'splice'
        },
        yAxis: {
            title: {
                text: yAxis ?? ''
            }
        },
        title: {
            text: title ?? ''
        },
        series: data,
    };

    return (
        <div>
            <HighchartsReact ref={chart} highcharts={Highcharts} options={options} />
        </div>
    )
}

export default HighChart