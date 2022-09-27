import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

function HighChart({ data, title, yAxis, type }) {
    const chart = useRef();
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

    const downloadCSV = () => {
        if (chart && chart.current && chart.current.chart) {
            chart.current.chart.downloadCSV();
        }
    };

    return (
        <div>
            <HighchartsReact ref={chart} highcharts={Highcharts} options={options} />
            <button onClick={downloadCSV}>Export</button>
        </div>
    )
}

export default HighChart