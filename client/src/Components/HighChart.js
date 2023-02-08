import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import Highcharts, { isNumber } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Action, { ACTION_TYPES } from '../Components/Action';

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

function StandardDeviation (arr) {
    const mean = Mean(arr);
    return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length);
}

function Mean (arr) {
    return arr.reduce((a, b) => a + b) / arr.length;
}

function Median (arr) {
    const l = arr.length;
    arr.sort((a, b) => a - b);
    return (l % 2 !== 0) ? arr[(l - 1) /  2] : ((arr[l / 2 - 1] + arr[l / 2]) / 2);
}

function Mode (arr) {
    let counts = {};
    let max = arr[0];
    arr.forEach(e => {
        if (e in counts) counts[e] += 1;
        else counts[e] = 0;
        if(counts[max] < counts[e]) max = e;
    });
    return max;
}

function RunStats (arr) {
    if (arr.length <= 0) return false;
    return {
        sum: arr.reduce((a, b) => a + b),
        min: Math.min(...arr),
        max: Math.max(...arr),
        mean: Mean(arr),
        mode: Mode(arr),
        median: Median(arr),
        standardDeviation: StandardDeviation(arr)
    };
}

function GenerateStats(arr=[]) {
    const stats = RunStats(arr);
    const t = key => (key === 'standardDeviation') ? 'Standard Deviation' : key[0].toUpperCase() + key.substr(1);
    const p = key => `<strong>${t(key)}</strong>: ${stats[key].toFixed(2)} <br />`;
    let output = "";
    Object.keys(stats).forEach(key => output += p(key));
    return output;
}

function HighChart({ data, title, yAxis, axisMax, type }) {
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
            type: type ?? 'column'
        },
        yAxis: {
            title: {
                text: yAxis ?? ''
            },
            max: axisMax
        },
        title: {
            text: title ?? ''
        },
        series: data,
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen", "printChart",
                        "separator",
                        "downloadPNG", "downloadJPEG", "downloadSVG", "downloadPDF",
                        "separator",
                        "downloadCSV", "downloadXLS"
                    ]
                }
            }
        }
    };

    function statistics(e) {
        let info = [];
        data.forEach(({data}) => data.forEach(({ y }) => { if(isNumber(y)) info.push(y) }));
        const html = GenerateStats(info);
        Swal.fire({ title, html, icon: 'info' });
    }

    return (
        <div>
            <Action type={ACTION_TYPES.INFO} classes={"py-2 px-2"} action={statistics} />
            <HighchartsReact ref={chart} highcharts={Highcharts} options={options} />
        </div>
    )
}

export default HighChart