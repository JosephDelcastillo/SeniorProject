import React, { useState } from 'react'
import Swal from 'sweetalert2';
import BarGraph from '../Components/BarGraph';
import LineGraph from '../Components/LineGraph';
import PieGraph from '../Components/PieGraph';

async function getData() {
    return fetch('/api').then(data => data.json());
}

function randColor (all = true) { 
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    while(!all && (color === '#000000' || color === '#FFFFFF')) {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    } 
    return color;
}

// Churns though data from api and reformats it for my purposes
function churnInitData(data) {
    let output = [];

    const USERS = new Set(data.map(e => e.user));
    const QUESTIONS = new Set(data.map(e => e.question));
    
    USERS.forEach(user => {
        // Re-init Responses
        let responses = [];
        QUESTIONS.forEach(question => { responses.push({ question: question, responses: [] }); })
        
        data.filter(e => e.user === user).forEach(({ question, submission, date, value }) => {
            responses[responses.findIndex(resp => resp.question === question)].responses.push({ submission: 'Submission ' + submission, date: date, value: value });
        });
        output.push({user: user, responses: responses });
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
    const GRAPH_TYPES = { bar: 'bar', line: 'line', pie: 'pie' };
    const [ backendData, setBackendData ] = useState([{}]);
    const [ graphType, setGraphType ] = useState(String);

    let value_color = randColor();
    
    const handleSubmit = async e => {
        e.preventDefault();

        if( graphType ) {
            const response = await getData();
            if(response.success) { 
                console.log(response.data);
                console.log(churnInitData(response.data)); 
                setBackendData(churnInitData(response.data)); 
            } else {
                Swal.fire({title: "Data Retrieval Failed", icon: 'error'})
            }
        }
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Report - All Users </h1>
            </div>
            <div className='card-body'>
                <hr />
                <form className='form' onSubmit={handleSubmit}>
                    <div className='row g-3 mx-4 align-items-center'>
                        <div className="col-3">
                            <label className="col-form-label" htmlFor='graphType'>Graph Type ({ graphType }) </label>
                        </div>
                        <div className="col-6">
                            <select className='form-control' id='graphType' onChange={e => (e.target.value) ? setGraphType(e.target.value) : null}>
                                <option value="">Select Graph Type</option>
                                <option value={GRAPH_TYPES.line}>Line</option>
                                <option value={GRAPH_TYPES.bar}>Bar</option>
                                <option value={GRAPH_TYPES.pie}>Pie</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <button className="form-control btn btn-outline-primary col-3" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
                <hr />
                {(graphType && backendData && backendData.length > 0 && backendData[0].user) ? ( 
                    backendData.map(({ user, responses }) => (
                        <div className='row'>
                            {responses.map(({question, responses}) => (
                                (question === 2 || question === 4) ? (<></>) : (
                                <div className='col-3'>
                                    <div className="card m-2 border-none">
                                        <div className="card-header bg-white text-center">
                                            <h4> User: {user} - Question {question} </h4>
                                        </div>
                                        <div className="card-body text-center">
                                        {(graphType === GRAPH_TYPES.bar) ? (
                                                <BarGraph key={`${user}-${question}`} xKey='submission' columns={[{id: 'value', color: value_color }]} data={responses} />
                                            ) : ( 
                                                (graphType === GRAPH_TYPES.pie) ? (
                                                    <PieGraph key={`${user}-${question}`} target='value' xKey='submission' columns={[{id: 'value', color: value_color }]} data={responses} />
                                                ) : (
                                                <LineGraph key={`${user}-${question}`} xKey='submission' columns={[{id: 'value', color: value_color }]} data={responses} />
                                            )
                                        )}
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                    ))
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Report