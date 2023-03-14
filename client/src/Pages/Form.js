
import React, { useState, useEffect } from 'react'
import Question from '../Components/Question'
import Swal from 'sweetalert2';

//TO DO: FILTER INCOMING DATA BY ENTRYID POSTED FROM RESPONSES
//TO DO: SETUP A POST FUNCTION TO POST FORM CHANGES TO DATABASE
//TO DO: ADD CSS AND STYLING
//TO DO: SETUP ON FORM SUBMIT FUNCITONALITY TO UPDATE BACKEND

const inputByID = (id) => document.getElementById(id).value;

/**
 *  ManageResponse Page
 * 
 *  Manages Individual Response
 * @returns {React.Component} 
 */
function Form({ api }) {
    const [serverQuestionData, setServerQuestionData] = useState([{}]);

    useEffect(() => {
        api({func: "GetQuestion", data: { search:"" } }).then(result => setServerQuestionData(result.data))
    },[setServerQuestionData,api]);


    const formSubmit = e => {
        let input = [];
        serverQuestionData.forEach(({id, archived}) => { if (!archived) input.push({ id, value: inputByID(id) }) });
        
        api({ func: 'AddSubmission', data: input }).then(({ success, message, data }) => {
            console.log(success);
            console.log(data); 
            if(!success) Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            if(success) Swal.fire({ title: 'Successfull Submitted', icon: 'success'}).then(e => window.location.pathname = '/dashboard/response/' + data)
        })
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Form - Submit A Response</h1>
            </div>
            <div className='card-body'>
                <div className="panel">
                    {(serverQuestionData && serverQuestionData.length > 0)?
                    (<form>
                        {serverQuestionData.filter(Question => Question.archived===false).map(({id, type, text}, i) => (
                            <Question key={id} number={i} id={id} type={type} text={text} show_number={false}/>
                        ))}
                        <button className='btn btn-success' type="button" onClick={formSubmit}>Submit</button>
                    </form>):(<></>)}
                </div>
            </div>
        </div>
    )
}

export default Form