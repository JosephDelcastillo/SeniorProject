import React, { useState } from 'react'
import Swal from 'sweetalert2';


async function getData() {
    return fetch('/api').then(data => data.json());
}

// Churns though data from api and reformats it for my purposes
function churnInitData(data) {
    let output = [];

    const USERS = new Set(data.map(e => e.user));
    const QUESTIONS = new Set(data.map(e => e.question));
    
    USERS.forEach(user => {
        // Re-init Responses
        let responses = [];
        QUESTIONS.forEach(question => { responses.push({ q: question, r: [] }); })
        
        data.filter(e => e.user === user).forEach(({ question, submission, value }) => {
            responses[responses.findIndex(resp => resp.q === question)].r.push({ s: submission, val: value });
        });
        output.push(responses);
    })
    return output;
} 

/**
 *  Report Page
 * 
 *  Renders Final Report Graphics  
 * @returns {React.Component} 
 */
function Report() {
    const [ backendData, setBackendData ] = useState([{}]);
    const [ graphType, setGraphType ] = useState(String);
    
    const handleSubmit = async e => {
        e.preventDefault();

        const response = await getData();
        if(response.success) { 
            console.log(response.data);
            console.log(churnInitData(response.data))
            setBackendData(churnInitData(response.data));
        } else {
            Swal.fire({title: "Data Retrieval Failed", icon: 'error'})
        }
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Report - All Users </h1>
            </div>
            <div className='card-body'>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='row g-3 align-items-center'>
                        <div className="col-3">
                            <label className="col-form-label" htmlFor='graphType'>Graph Type ({ graphType }) </label>
                        </div>
                        <div className="col-6">
                            <select className='form-control' id='graphType' onChange={e => (e.target.value) ? setGraphType(e.target.value) : null}>
                                <option>Select Graph Type</option>
                                <option value='Line'>Line</option>
                                <option value='Bar'>Bar</option>
                                <option value='Pie'>Pie</option>
                                {/* npm install react-charts@beta --save */}
                            </select>
                        </div>
                        <div className='col-3'>
                            <button className="form-control btn btn-outline-primary col-3" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
                <div id='dataGraphs'></div>
            </div>
        </div>
    )
}

export default Report