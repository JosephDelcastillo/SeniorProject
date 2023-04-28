import React, { useState, useEffect, useRef } from 'react'
import HighChartTypes from './HighChartTypes';
import ReportData from './ReportData';
import HighChart from './HighChart';
import { v4 as uuid } from 'uuid';
import Loading from './Loading';
import Swal from 'sweetalert2';

function ReportGraph({ api }) {
    const [activeQuestion, setActiveQuestion] = useState('');
    const [graphType, setGraphType] = useState('');
    const [reportData, setReportData] = useState([{}]);
    const chartTypeReference = useRef();
    const questionReference = useRef();

    useEffect(() => {
        async function fetchData() {
            const input = {
                people: -202,       // Current User
                questions: [-202],  // All  Questions
                graphType: "spline",
                dates: {            // All Responses
                    start: '01-01-1999', 
                    end: new Date().toISOString().slice(0, 10) 
                }
            }
            let { success, data } = await api({ func: 'GetReport', data: input });
            if (!success) return Swal.fire({ icon: 'error', title: 'Error Retreiving Main Report' })
            data.questions.sort((a, b) => a.priority - b.priority);
            setReportData({ ...data, output: ReportData(data) });
            setGraphType("spline")
            setActiveQuestion(data.questions[0].text)
        }
        fetchData();
    }, [api, setReportData, setGraphType, setActiveQuestion])

    function updateReport() {
        if (chartTypeReference.current.value) setGraphType(chartTypeReference.current.value)
        if (questionReference.current.value) setActiveQuestion(questionReference.current.value)
    }
    if(!reportData || !reportData.submissions || reportData.submissions.length <= 0) 
        return(<Loading blank={true} />)
    return (
        <div className='col-12 row'>
            <div className='card'>
                <div className='card-body'>
                    {/* Render Output */}
                    <div className='row'>
                        {(!activeQuestion || !activeQuestion.length || activeQuestion.length <= 0) ? (<></>):
                            reportData.output.filter(({ name }) => name === activeQuestion).map(({ name, data, goal }) => (
                                <div key={uuid()} className='w-100'>
                                    <HighChart key={uuid()} data={data} type={graphType} yAxis="Response Value" title={name} axisMax={goal} />
                                </div>
                            ))
                        }
                    </div>
                    {/* Form */}
                    <div className='row'>
                        <div className='col-md col-sm-12 col-xs-12'>
                            <select className='form-control' ref={questionReference}>
                                <option value="">Selected Question</option>
                                {reportData.questions.map(({ text }) => (
                                    <option key={uuid()} value={text} selected={activeQuestion && text === activeQuestion}>{text}</option>
                                ))}
                            </select>
                        </div>
                        <div className='col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12'>
                            <HighChartTypes selected={graphType} refAnchor={chartTypeReference} />
                        </div>
                        <div className='col-xl-2 col-md-3 col-sm-6 col-xs-12'>
                            <label className='btn btn-outline-primary w-100' onClick={updateReport}> Update </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportGraph