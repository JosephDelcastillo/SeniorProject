/**
 * Report Generation Form 
 */
import React, { useState } from 'react'

import HighChart from '../Components/HighChart'
import Swal from 'sweetalert2'
import axios from 'axios';

// Constants 
const GRAPH_TYPES = { bar: 'bar', line: 'line', pie: 'pie' };

// Helper Functions 
// Query the Backend
async function callAPI({ func = '', info, getToken }) {
    let data = { token: getToken(), data: info };
    console.log(data)
    return axios.post('/api' + func, data).then(response => response.data);
}

// Shorthand for Input Value gain  
const inputByID = (id) => document.getElementById(id).value;

// Generate Dropdown Element
function DropDownElem ({text, func}) {
    return (<li><button className="dropdown-item" type="button" onClickCapture={func}>{text ?? ''}</button></li>); 
}

// Temporary Constants and Functions 
const genCats = (arr, count) => { if (count > 0) { arr.push('Submission ' + (arr.length + 1)); return genCats(arr, count - 1); } else { return arr; } }
const dummyData = [ 
    {
        name: 'Employee A',
        categories: genCats([], 11),
        data: [43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157, 161454, 154610]
    }, {
        name: 'Employee B',
        categories: genCats([], 11),
        data: [24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050]
    }, {
        name: 'Employee C',
        categories: genCats([], 11),
        data: [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663]
    }, {
        name: 'Employee D',
        categories: genCats([], 11),
        data: [null, null, null, null, null, null, null, null, 11164, 11218, 10077]
    }, {
        name: 'Employee E',
        categories: genCats([], 11),
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073]
    } 
];


/**
 *  Report Page
 * 
 *  Renders Final Report Graphics  
 * @returns {React.Component} 
 */
function Report({ getToken }) {
    const [ backendData, setBackendData ] = useState([{}]);
    const [ peopleOptions, setPeopleOptions ] = useState([{}]);
    // const [ graphType, setGraphType ] = useState("line");

    let pieData = [];
    dummyData.forEach(({ name, categories, data }, entryIndex) => { 
        pieData.push({ name, data: [] });
        data.forEach((submission, submissionIndex) => { 
            if(submission) pieData[entryIndex].data.push({ name: categories[submissionIndex], y: submission }); 
        }); 
    })
    
    function addPerson(id, name) {
        console.log('Add Person')
        console.log(id)
        console.log(name)
    }

    const handleSubmit = async e => {
        e.preventDefault();
        // First Get Informaiton 
        let input = {
            people: inputByID("people") ?? 0,
            dates: {
                start: inputByID("sDate") ?? '01-01-1999',
                end: inputByID("eDate") ?? new Date().toISOString().slice(0, 10)
            }, 
            graphType: inputByID("graphType") ?? 'line',            
            questions: inputByID("questions") ?? 0
        }
        console.log(input);
        // Then Query the Backend for Report Data 
        // const response = await callAPI({ func: '/staff', info: input, getToken });
        // if(response.success) { 
        //     console.log(response.data);
        //     setBackendData(response.data); 
        // } else {
        //     console.log(response.data);
        //     Swal.fire({title: "Data Retrieval Failed", icon: 'error'})
        // }
    }

    const searchPeople = async e => {
        console.log(e.target.value)

        const response = await callAPI({ func: '/staff', info: { search: e.target.value }, getToken });
        if(response.success) { 
            console.log(response.data);
            setPeopleOptions(response.data);
        } else {
            console.log(response.data);
        }


        // document.getElementById('peopleDD').classList.add('show')
        // document.getElementById('peopleDD').classList.remove('show')
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Report - All Users </h1>
            </div>
            <div className='card-body'>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='mb-2' id='peoplePills'> 
                        <div className="btn btn-success rounded-pill m-1">Primary <span className='ms-2'>X</span></div>
                    </div>
                    <div className='row mb-2 align-items-center'>
                        <div className='col-xl-6 col-lg-12'>
                            <input id='people' type='hidden' className='form-control' placeholder='Select People for the Report' />
                            <div className="btn-group w-100">
                                <ul className="dropdown-menu mt-5" id='peopleDD'>
                                    {(peopleOptions && peopleOptions.length > 0 && peopleOptions[0].name) ? (
                                        peopleOptions.map(({ id, name, email }) => ( 
                                            <DropDownElem key={id} text={name + `(${email})`} func={() => { addPerson(id, name); }}/> 
                                        ))
                                    ) : (<></>)}
                                </ul>
                                <input id='peopleCurrent' onChangeCapture={searchPeople} type='text' className='form-control' placeholder='Select People for the Report' />
                            </div>
                        </div>
                        <div className='col-xl-4 col-lg-8'>
                            <div className='row g-0 align-items-center'>
                                <div className='col-5'>
                                    <input id='sDate' type="date" className='form-control' defaultValue='1999-01-01'/>
                                </div>
                                <div className='col-2 text-center'>
                                    <span> to </span>
                                </div>
                                <div className='col-5'>
                                    <input id='eDate' type="date" className='form-control' defaultValue={new Date().toISOString().slice(0, 10)} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-4">
                            <select className='form-control text-center' id='graphType'>
                                <option value="">Graph Type</option>
                                <option value={GRAPH_TYPES.line}>Line</option>
                                <option value={GRAPH_TYPES.bar}>Bar</option>
                                <option value={GRAPH_TYPES.pie}>Pie</option>
                            </select>
                        </div>
                    </div>
                    <div className='row mb-2 align-items-center'>
                        <div className='col-lg-10 col-md-12'>
                            <input id='questions' type='text' className='form-control' placeholder='Select Questions for the Report' />
                        </div>
                        <div className='col-lg-2 col-md-12'>
                            <button className='btn btn-success w-100' type='submit'> Generate </button>
                        </div>
                    </div>
                </form>
                <hr />
                <HighChart data={pieData} type="bar" yAxis="Response Value" />
                <hr />
                {(backendData && backendData.length > 0 && backendData[0].user) ? ( <></>
                    // backendData.map(({ user, responses }) => (
                    //     <div className='row'>
                    //         {responses.map(({question, responses}) => (
                    //             (question === 2 || question === 4) ? (<></>) : (
                    //                 <div className='col-3'>
                    //                 <div className="card m-2 border-none">
                    //                     <div className="card-header bg-white text-center">
                    //                         <h4> User: {user} - Question {question} </h4>
                    //                     </div>
                    //                     <div className="card-body text-center"> 
                    //                         <HighChart data={pieData} type={graphType} yAxis="Response Value" />
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         )))} 
                    //     </div>
                    // ))
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Report