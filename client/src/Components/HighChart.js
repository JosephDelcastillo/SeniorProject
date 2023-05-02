import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import Highcharts, { isNumber } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Action, { ACTION_TYPES } from '../Components/Action';
import { csv as Download } from './Download';

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

function GenerateStats (arr=[]) {
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

function StatsHTML(stats={}, fixed=2) {
    let output = `<table class="m-auto table table-striped table-hover">
                    <tbody>`;
    Object.keys(stats).forEach(key => output += `
            <tr>
                <td class="text-start">
                    <strong>${(key === 'standardDeviation') ? 'Standard Deviation' : key[0].toUpperCase() + key.substr(1)}</strong>
                </td>
                <td class="text-end">
                    ${stats[key].toLocaleString("en-US", { minimumFractionDigits: fixed, maximumFractionDigits: fixed })} <br />
                </td>
            </tr>
        `);
    output += `</tbody>
        </table>`;
    return output;
}

function statsCSV(stats={}, fixed=4) {
    let output = '';
    function k(key) { return (key === 'standardDeviation') ? 'Standard Deviation' : key[0].toUpperCase() + key.substr(1); }
    Object.keys(stats).forEach(key => output += `${k(key)},${stats[key].toFixed(fixed)}\n`);
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
                        "downloadPNG", "downloadJPEG", "downloadSVG", "downloadPDF"
                    ]
                }
            }
        }
    };

    function statistics(e) {
        let info = [];
        data.forEach(({data}) => data.forEach(({ y }) => { if(isNumber(y)) info.push(y) }));
        const stats = GenerateStats(info)
        const html = StatsHTML(stats);
        Swal.fire({ 
            title, 
            html, 
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Download',
            cancelButtonText: `Close`
        }).then(result => {
            if (!result.isConfirmed) return;

            const today = new Date();
            Download(statsCSV(stats), `${today.toISOString().split('T')[0]} ${title} Statistics`);

            const seconds = 3;
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: seconds * 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    toast.addEventListener('mouseup', Swal.close)
                }
            }).fire({ title: 'Download Initiated!', icon: 'success' })
        });
    }

    return (
        <div className='position-relative'>
            <HighchartsReact ref={chart} highcharts={Highcharts} options={options} />
            <Action type={ACTION_TYPES.INFO} classes={"position-absolute top-0 start-0 pt-2 ps-2"} action={statistics} />
        </div>
    )
}

export default HighChart