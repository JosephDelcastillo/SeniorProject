/**
 * Report Generation Form 
 */
import React, { useState } from 'react'
import HighChart from '../Components/HighChart'
import Swal from 'sweetalert2'

// Constants 
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
// Shorthand Every-Other
const EO = (i, r = 2) => (i % r === 0);
// Shorthand for Input Value gain  
const inputByID = (id) => document.getElementById(id).value;

// Shorthand to close Search Dropdowns
const closeDropDown = id => document.getElementById(id).classList.remove('show');
const openDropDown = id => document.getElementById(id).classList.add('show');


/**
 *  Report Page
 * 
 *  Renders Final Report Graphics  
 * @returns {React.Component} 
 */
function Report({ getToken, api }) {
    const [ graphType, setGraphType ] = useState([{}]);
    const [ backendData, setBackendData ] = useState([{}]);
    const [ peopleOptions, setPeopleOptions ] = useState([{}]);
    const [ peopleSelected, setPeopleSelected ] = useState([{}]);
    const [ questionOptions, setQuestionOptions ] = useState([{}]);
    const [ questionSelected, setQuestionSelected ] = useState([{}]);

    // Variables to be used throughout 
    let peopleFixed = false;
    let questionFixed = false;
    
    // Helper Functions 
    // Shorthand for People DropDowns 
    const fixPeople = e => peopleFixed = true;
    const unfixPeople = e => peopleFixed = false;
    const closePeople = e => { if (!peopleFixed) closeDropDown('peopleDD') } ;
    const openPeople = e => openDropDown('peopleDD');
    // Shorthand for Question DropDowns 
    const fixQuestion = e => questionFixed = true;
    const unfixQuestion = e => questionFixed = false;
    const closeQuestion = e => { if (!questionFixed) closeDropDown('questionDD') } ;
    const openQuestion = e => openDropDown('questionDD');
    
    // Use Case Functions 
    // People 
    // Add Person to Selected 
    function addPerson (id, name) {
        let temp = [ ...peopleSelected];
        if (temp.length <= 0 || (temp.findIndex(p => p.id === id) < 0) ) { 
            temp.push({ id: id, name: name }); 
            temp = temp.filter(p => (Object.keys(p).length !== 0) ? true : false); // Strip Empties
            temp = temp.sort((a, b) => a.id > b.id); // Sort By ID 
            setPeopleSelected(temp); 
        }
        unfixPeople();
        closePeople();
        document.getElementById('selectPeople').value = '';
    }
    // Remove Person From Selected 
    function removePerson (id) {
        let temp = [ ...peopleSelected];
        const f = temp.findIndex(p => p.id === id);
        if (f >= 0) {
            temp.splice(f, 1); 
            setPeopleSelected(temp); 
        }
        unfixPeople();
        closePeople();
    }
    // Update People Options 
    const searchPeople = async e => {
        const { success, data } = await api({ func: 'GetStaff', data: { search: e.target.value } });
        if(success) {
            setPeopleOptions(data.filter(d => (peopleSelected.findIndex(p => p.id === d.id) !== -1) ? false : true));
        }
    }

    // Question
    // Add Question to Selected 
    function addQuestion (id, text) {
        let temp = [ ...questionSelected];
        if (temp.length <= 0 || (temp.findIndex(p => p.id === id) < 0) ) { 
            temp.push({ id: id, text: text }); 
            temp = temp.filter(p => (Object.keys(p).length !== 0) ? true : false); // Strip Empties
            temp = temp.sort((a, b) => a.id > b.id); // Sort By ID 
            setQuestionSelected(temp); 
        }
        unfixQuestion();
        closeQuestion();
        document.getElementById('questions').value = '';
    }
    // Remove Question From Selected 
    function removeQuestion (id) {
        let temp = [ ...questionSelected];
        const f = temp.findIndex(p => p.id === id);
        if (f >= 0) {
            temp.splice(f, 1); 
            setQuestionSelected(temp); 
        }
        unfixQuestion();
        closeQuestion();
    }
    // Update Question Options 
    const searchQuestion = async e => { // TODO: Fix Get Question 
        const { success, data } = await api({ func: 'GetQuestion', data: { search: e.target.value, "no_notes": true } });
        if(success) {
            setQuestionOptions(data.filter(d => (questionSelected.findIndex(p => p.id === d.id) !== -1) ? false : true));
        }
    }

    // Generate Report 
    const handleSubmit = async e => {
        e.preventDefault();
        let errors = [];

        // Get Informaiton 
        let input = {
            people: peopleSelected.map(p=>p.id) || [{}],
            dates: {
                start: inputByID("sDate") || '01-01-1999',
                end: inputByID("eDate") || new Date().toISOString().slice(0, 10)
            }, 
            graphType: inputByID("graphType"),
            questions: questionSelected.map(q=>q.id) || [{}]
        }

        // Validation 
        if (input.people.length <= 0) errors.push("People"); 
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
            let prep = data.questions.map(({ id, name }) => { return {name, question: id} });
            // Next Add Employees to each Question 
            prep.map(e => e.data = data.people.map(({id, name}) => { return { name, person: id } }));
            // Then Add Submission to Each Question/Employee 
            prep.map(q => q.data.map(p => p.data = data.submissions.filter(s => s.user === p.person).map(s => {return { name: 'Submission ' + s.id, submission: s.id }})) )
            // Then Add Responses to Each Submission
            prep.map(q => q.data.map(p => p.data.map(s => s.y = data.responses.find(r => (r.submission === s.submission && r.question === q.question)).response ?? -1)) )
            // Finally Remove all the helper values from the object
            let output = prep.map(({ name, data }) => { 
                return { name, data: data.map(({ name, data }) => {
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
                <h1> Report - All Users </h1>
            </div>
            <div className='card-body'>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='mb-2' id='peoplePills'> 
                    {(peopleSelected.length && Object.keys(peopleSelected[0]).length > 0) ? (
                        peopleSelected.map(({id, name}, index) => (
                            <div key={'peopleSelected' + id} className={`btn btn-${EO(index)?'success':'primary'} rounded-pill m-1`}>
                                {name} <span className='ms-2' onClickCapture={e => {removePerson(id)}}>X</span>
                            </div>
                        ))
                    ) : (<></>)}
                    </div>
                    <div className='row mb-2 align-items-center'>
                        <div className='col-xl-6 col-lg-12'>
                            <div className="btn-group w-100">
                                {(peopleOptions && peopleOptions.length > 0 && peopleOptions[0].name) ? (
                                    <ul className="dropdown-menu mt-5" id='peopleDD'>
                                        {(peopleSelected.findIndex(({id}) => id === -202) >= 0)?(<></>):(
                                            <li key="AllPeople">
                                                <button className="dropdown-item" type="button" onClickCapture={() => { addPerson(-202, 'All'); }} 
                                                    onMouseEnter={fixPeople} onMouseLeave={unfixPeople} onBlurCapture={closePeople}>
                                                    All People 
                                                </button>
                                            </li>
                                        )}
                                        {peopleOptions.map(({ id, name, email }) => (peopleSelected.findIndex((s) => s.id === id) >= 0)?(<></>):( 
                                            <li key={'peopleOptions'+id}>
                                                <button className="dropdown-item" type="button" onClickCapture={() => { addPerson(id, name); }} 
                                                    onMouseEnter={fixPeople} onMouseLeave={unfixPeople} onBlurCapture={closePeople}>
                                                    {name} ({email}) 
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="dropdown-menu mt-5" id='peopleDD'>
                                        <li>
                                            <button className="dropdown-item" type="button" onClickCapture={() => { addPerson(-202, 'All'); }} 
                                                onMouseEnter={fixPeople} onMouseLeave={unfixPeople} onBlurCapture={closePeople}>
                                                All
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                <input type='text' id="selectPeople" className='form-control' placeholder='Select People for the Report' 
                                    onChangeCapture={searchPeople} onBlurCapture={closePeople} onFocusCapture={openPeople} autoComplete='off' />
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
                                {GRAPH_TYPES.map(({ name, value }) => <option value={value}>{name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='mb-2' id='questionPills'> 
                    {(questionSelected.length && Object.keys(questionSelected[0]).length > 0) ? (
                        questionSelected.map(({id, text}, index) => (
                            <div key={'questionSelected' + id} className={`btn btn-${EO(index)?'primary':'success'} rounded-pill m-1`}>
                                {text} <span className='ms-2' onClickCapture={e => {removeQuestion(id)}}>X</span>
                            </div>
                        ))
                    ) : (<></>)}
                    </div>
                    <div className='row mb-2 align-items-center'>
                        <div className='col-lg-10 col-md-12'>
                            <div className="btn-group w-100">
                                {(questionOptions && questionOptions.length > 0 && questionOptions[0].text) ? (
                                    <ul className="dropdown-menu mt-5" id='questionDD'>
                                        {(questionSelected.findIndex(({id}) => id === -202) >= 0)?(<></>):(
                                            <li key="AllQuestions">
                                                <button className="dropdown-item" type="button" onClickCapture={() => { addQuestion(-202, 'All'); }} 
                                                    onMouseEnter={fixQuestion} onMouseLeave={unfixQuestion} onBlurCapture={closeQuestion}>
                                                    All Questions 
                                                </button>
                                            </li>
                                        )}
                                        {questionOptions.map(({ id, text }) => (questionSelected.findIndex((s) => s.id === id) >= 0)?(<></>):( 
                                            <li key={'questionOption'+id}>
                                                <button className="dropdown-item" type="button" onClickCapture={() => { addQuestion(id, text); }} 
                                                    onMouseEnter={fixQuestion} onMouseLeave={unfixQuestion} onBlurCapture={closeQuestion}>
                                                    {text}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="dropdown-menu mt-5" id='questionDD'>
                                        <li>
                                            <button className="dropdown-item" type="button" onClickCapture={() => { addQuestion(-202, 'All'); }} 
                                                onMouseEnter={fixQuestion} onMouseLeave={unfixQuestion} onBlurCapture={closeQuestion}>
                                                All
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                <input id='questions' type='text' className='form-control' placeholder='Select Questions for the Report' 
                                    onChangeCapture={searchQuestion} onBlurCapture={closeQuestion} onFocusCapture={openQuestion} autoComplete='off' />
                            </div>
                        </div>
                        <div className='col-lg-2 col-md-12'>
                            <button className='btn btn-success w-100' type='submit'> Generate </button>
                        </div>
                    </div>
                </form>
                <hr className='my-4' />
                {(backendData.length > 0 && Object.keys(backendData[0]).length > 0) ? ( 
                    backendData.map(({ name, data }) => (
                        <div className='w-100 my-3 border'>
                            <HighChart data={data} type={graphType} yAxis="Response Value" title={name} />
                        </div>
                    ))
                    // <p>{JSON.stringify(backendData[0].data)}</p>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Report