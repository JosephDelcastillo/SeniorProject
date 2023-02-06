import React, { useState } from 'react';


// Helper Functions 
// Shorthand Every-Other
const EO = (i, r = 2) => (i % r === 0);
// Shorthand to close Search Dropdowns
const closeDropDown = id => document.getElementById(id).classList.remove('show');
const openDropDown = id => document.getElementById(id).classList.add('show');


function ReportAdmin({ GRAPH_TYPES, api, people, questions }) {
    const [ peopleOptions, setPeopleOptions ] = useState([{}]);
    const [ peopleSelected, setPeopleSelected ] = people;
    const [ questionOptions, setQuestionOptions ] = useState([{}]);
    const [ questionSelected, setQuestionSelected ] = questions;

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
    const searchQuestion = async e => {
        const { success, data } = await api({ func: 'GetQuestion', data: { search: e.target.value, "no_notes": true } });
        if(success) {
            setQuestionOptions(data.filter(d => (questionSelected.findIndex(p => p.id === d.id) !== -1) ? false : true));
        }
    }

    return (<>
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
    </>)
}

export default ReportAdmin