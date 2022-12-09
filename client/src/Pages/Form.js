
import React, { useState, useEffect } from 'react'
import Question from '../Components/Question'
import Swal from 'sweetalert2';
//import 'bootstrap/dist/css/bootstrap.min.css'



//TO DO: FILTER INCOMING DATA BY ENTRYID POSTED FROM RESPONSES
//TO DO: SETUP A POST FUNCTION TO POST FORM CHANGES TO DATABASE
//TO DO: ADD CSS AND STYLING
//TO DO: SETUP ON FORM SUBMIT FUNCITONALITY TO UPDATE BACKEND

/**
 *  ManageResponse Page
 * 
 *  Manages Individual Response
 * @returns {React.Component} 
 */

//Setup state tracking and pull data
const BuildForm = () => {
    const [questionData, setQuestionData] = useState([{}]);

    const getQuestionData = async () => {
        const response = await fetch('/api/form').then(data => data.json());
        console.log('response', response)
        if (response.success) {
            console.log(response.data);
            setQuestionData(response.data);
            return (response.data);
        } else {
            console.log("failed");
        }
    }

    useEffect(() => {
        getQuestionData()
            .then((res) => {
                setQuestionData(res)
            })
            .catch((e) => {

            })
    }, []);



    return (
            <form>
                {questionData.map((question, index) => {
                    return (
                        <div className="form-group" key={index}>
                            <>
                                <label htmlFor={question.question}>{question.question}:</label>
                                <input id='dynamicForm' className='form-control' type="text"></input>
                                
                            </>
                        </div>
                    );
                })}
               
                
                <br></br>
                <br></br>
                <button type="submit" className="btn btn-primary">Submit</button>
                <a href='/dashboard/form-edit' className='btn btn-light'> Edit </a> <br />
            </form>
    )
}


const inputByID = (id) => document.getElementById(id).value;

//Display Page
function Form({api}) {
    const [serverQuestionData, setServerQuestionData] = useState([{}]);

    useEffect(() => {
        api({func: "GetQuestion", data: { search:"" } }).then(result => setServerQuestionData(result.data))
    },[setServerQuestionData,api])


    const formSubmit = e => {
        let input = [];
        serverQuestionData.forEach(({id}) => input.push({ id, value: inputByID(id) }));
        
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
                        {serverQuestionData.map(({id, type, text}, i) => (<Question key={id} number={i} id={id} type={type} text={text}/>))}

                        <button className='btn btn-success' type="button" onClick={formSubmit}>Submit</button>
                    </form>):(<></>)}
                </div>
            </div>
        </div>
    )
}

export default Form