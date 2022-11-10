
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'



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
    const [newField, setNewField] = useState()
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

    const onAddQuestion = () => {
        setNewField({ newQuestion: '', newAnswer: '' })
    }

    const onInputChange = (e, field) => {
        const val = e.target.value;
        setNewField({ ...newField, [field]: val })
    }

    const onSaveQuestion = () => {
        setQuestionData([...questionData, { question: newField.newQuestion }])
    } 
    
    const onDeleteQuestion = (questionIndex) => {
        const filteredQuestionData = questionData.filter((_question, index) => index !== questionIndex)
        setQuestionData(filteredQuestionData)
    }

    return (
            <form>
                {questionData.map((question, index) => {
                    return (
                        <div className="form-group" key={index}>
                            <>
                                <label htmlFor={question.question}>{question.question}:</label>
                                <input id='dynamicForm' className='form-control' type="text"></input>
                                <button type="button" onClick={() => onDeleteQuestion(index)} className="btn btn-primary">Delete</button>
                            </>
                        </div>
                    );
                })}
                {newField ? <>
                    Add new question
                    <br />
                    <input type='text' name='newQuestion' placeholder='Enter question' value={newField.newQuestion} onChange={(evt) => onInputChange(evt, 'newQuestion')} />
                    <br />
                    <input type='text' name='newAnswer' placeholder='Enter answer' value={newField.newAnswer} onChange={(evt) => onInputChange(evt, 'newAnswer')} />                    
                    <button type="button" onClick={onSaveQuestion} className="btn btn-primary">Save</button>
                </> : null}
                <br></br>
                <br></br>
                <button type="button" onClick={onAddQuestion} className="btn btn-primary">Add Question</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                
            </form>
    )
}

//Display Page
function FormEdit() {
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Form - Submit A Response</h1>
            </div>
            <div className='card-body'>
                <div className="panel">
                    <hr />
                    {BuildForm()}
                </div>
            </div>
        </div>
    )
}

export default FormEdit