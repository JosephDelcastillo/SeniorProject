import React, { useState } from 'react';


// Helper Functions 
// Shorthand Every-Other
const EO = (i, r = 2) => (i % r === 0);
// Shorthand to close Search Dropdowns
const closeDropDown = id => document.getElementById(id).classList.remove('show');
const openDropDown = id => document.getElementById(id).classList.add('show');



function ReportStaff({ GRAPH_TYPES, api, questions }) {
  const [ questionOptions, setQuestionOptions ] = useState([{}]);
  const [ questionSelected, setQuestionSelected ] = questions;

  // Variables to be used throughout 
  let questionFixed = false;
  
  // Helper Functions 
  // Shorthand for Question DropDowns 
  const fixQuestion = e => questionFixed = true;
  const unfixQuestion = e => questionFixed = false;
  const closeQuestion = e => { if (!questionFixed) closeDropDown('questionDD') } ;
  const openQuestion = e => openDropDown('questionDD');


  // Use Case Functions 
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
          <div className='col-lg-12 col-md-12'>
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
      </div>
      <div className='row mb-2 align-items-center'>
          <div className='col-xl-6 col-lg-8'>
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
          <div className="col-xl-3 col-lg-4">
              <select className='form-control text-center' id='graphType'>
                  <option value="">Graph Type</option>
                  {GRAPH_TYPES.map(({ name, value }) => <option value={value}>{name}</option>)}
              </select>
          </div>
          <div className='col-lg-3 col-md-12'>
              <button className='btn btn-success w-100' type='submit'> Generate </button>
          </div>
      </div>
  </>)
}

export default ReportStaff