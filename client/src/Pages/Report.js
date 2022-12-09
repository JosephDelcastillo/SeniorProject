 /**
 * Report Generation Form 
 */
import React, { useState } from 'react'
import HighChart from '../Components/HighChart'
import Swal from 'sweetalert2'
import ReportAdmin from '../Components/ReportAdmin';
import ReportStaff from '../Components/ReportStaff';

// Constants 
const API_URL = (true) ? "https://epots-api.azurewebsites.net/api" : '/api';
const GRAPH_TYPES = [
    { name: 'Bar (Horizontal)', value: 'bar'}, 
    { name: 'Column (Vertical)', value: 'column'}, 
    { name: 'Spline (Curved)', value: 'spline'}, 
    { name: 'Area (Underarea)', value: 'area'}, 
    { name: 'Line (Straight)', value: 'line'}, 
    { name: 'Scatter', value: 'scatter'}, 
    { name: 'Pie', value: 'pie'}, 
];

// Helper Functions 
// Shorthand for Input Value gain  
const inputByID = (id) => document.getElementById(id).value;


/**
 *  Report Page
 * 
 *  Renders Final Report Graphics  
 * @returns {React.Component} 
 */
function Report({ api, isAdmin }) {
    const [ graphType, setGraphType ] = useState([{}]);
    const [ backendData, setBackendData ] = useState([{}]);
    const [ peopleSelected, setPeopleSelected ] = useState([{}]);
    const [ questionSelected, setQuestionSelected ] = useState([{}]);

    const PeopleState = [peopleSelected, setPeopleSelected];
    const QuestionsState = [questionSelected, setQuestionSelected];

    // Generate Report 
    const handleSubmit = async e => {
        e.preventDefault();
        let errors = [];

        // Get Informaiton 
        let input = {
            people: isAdmin() ? (peopleSelected.map(p=>p.id) || [{}]) : -202,
            dates: {
                start: inputByID("sDate") || '01-01-1999',
                end: inputByID("eDate") || new Date().toISOString().slice(0, 10)
            }, 
            graphType: inputByID("graphType"),
            questions: questionSelected.map(q=>q.id) || [{}]
        }

        // Validation 
        if (isAdmin() && input.people.length <= 0) errors.push("People"); 
        if (input.questions.length <= 0) errors.push("Questions"); 
        if (input.graphType.length <= 0) errors.push("Graph Type"); 

        if(errors.length > 0) {
            let msg = errors.join(' and ');
            Swal.fire({ title: 'Missing Information to Generate', text: 'Missing Information for ' + msg, icon: 'error' })
            return false;
        }
        
        // Then Query the Backend for Report Data 
        const { success, data } = await api({ func: 'GetReport', data: input });
        if(success) { 
            setGraphType(input.graphType)
            // Final Structure [{ question: Question #, data: [{ name: Employee Name, data: [{ name: Submission #, y: Submission Value }] }] }]
            // First Get Questions 
            let prep = data.questions.map(({ id, text }) => { return {name: text, question: id, goal: undefined} });
            // Next Add Employees to each Question 
            prep.map(e => e.data = data.people.map(({id, name}) => { return { name, person: id } }));
            // Then Add Submission to Each Question/Employee 
            prep.map(q => q.data.map(p => p.data = data.submissions.filter(s => s.user === p.person).map(s => {return { name: 'Submission ' + s.created, submission: s.id }})) )
            // Then Add Responses to Each Submission
            prep.map(q => q.data.map(p => p.data.map(s => s.y = data.responses.find(r => (r.submission === s.submission && r.question === q.question)).response ?? -1)) )
            // Finally Remove all the helper values from the object
            let output = prep.map(({ name, data, goal }) => { 
                return { name, goal, data: data.map(({ name, data }) => {
                    return { name, data: data.map(({ name, y }) => { 
                        return { name, y: parseInt(y) } 
                    })}
                })} 
            }); 
            setBackendData(output);
        } else {
            Swal.fire({title: "Data Retrieval Failed", icon: 'error'})
        }
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Report Generation </h1>
            </div>
            <div className='card-body'>
                <form className='form' onSubmit={handleSubmit}>
                    {(isAdmin())?(
                        <ReportAdmin GRAPH_TYPES={GRAPH_TYPES} api={api} people={PeopleState} questions={QuestionsState} />
                    ):(
                        <ReportStaff GRAPH_TYPES={GRAPH_TYPES} api={api} questions={QuestionsState} />
                    )}
                </form>
                <hr className='my-4' />
                {(backendData.length > 0 && Object.keys(backendData[0]).length > 0) ? ( 
                    backendData.map(({ name, data, goal }) => (
                        <div className='w-100 my-3 border'>
                            <HighChart key={name} data={data} type={graphType} yAxis="Response Value" title={name} axisMax={goal} />
                        </div>
                    ))
                    // <p>{JSON.stringify(backendData[0].data)}</p>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Report