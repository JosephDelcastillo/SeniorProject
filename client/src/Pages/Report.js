/**
 * Report Generation Form 
 */
import React, { useState } from 'react';
import HighChart from '../Components/HighChart';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';

import ReportData from '../Components/ReportData';
import ReportAdmin from '../Components/ReportAdmin';
import ReportStaff from '../Components/ReportStaff';

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
            questions: questionSelected.map(q => q.id) || [{}]
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
        if (success && data.length <= 0) return Swal.fire({ icon: 'error', title: "Failed to Generate", text: "No submissions found in database" })
        if (success) { 
            setGraphType(input.graphType)
            setBackendData(ReportData(data));
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
                        <ReportAdmin key='AdminReportMenu' api={api} people={PeopleState} questions={QuestionsState} />
                    ):(
                        <ReportStaff key='StaffReportMenu' api={api} questions={QuestionsState} />
                    )}
                </form>
                <hr className='my-4' />
                {(backendData.length > 0 && Object.keys(backendData[0]).length > 0) ? ( 
                    backendData.map(({ name, data, goal }) => (
                        <div key={uuid()} className='w-100 my-3 border'>
                            <HighChart key={uuid()} data={data} type={graphType} yAxis="Response Value" title={name} axisMax={goal} />
                        </div>
                    ))
                    // <p>{JSON.stringify(backendData[0].data)}</p>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Report