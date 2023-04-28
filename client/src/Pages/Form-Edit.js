
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';

import Action, { ACTION_TYPES } from '../Components/Action';
import { v4 as uuid } from 'uuid'



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
function FormEdit({api}) {
    const [serverQuestionData, setServerQuestionData] = useState([{}]);

    useEffect(() => {
        api({func: "GetQuestion", data: { search:"" } }).then(result => setServerQuestionData(result.data))

    },[setServerQuestionData,api]);

    async function ToEdit(id, text, type, goals){
        Swal.fire({
            title: 'Edit Question Content',
            confirmButtonText:"Save Changes",
            showCloseButton: true,
            html:`        
                <input id="editId" type="hidden" value="${id}"></input>
                <label>Question Text
                    <br/>
                    <input id="editText" value="${text}"></input>
                </label>
                <label>Goal
                <br/>
                <input id="editGoals" value="${goals}"></input>
            </label>
                <label>Response Type
                    <br/>
                    <select id="editType">
                        <option value="number" ${type === "number" ? "selected" : ""}> Number </option>
                        <option value="note" ${type === "note" ? "selected" : ""}> Text </option>
                    </select>
                </label>
            <br/>
            `
        }).then((result) =>{
            if(result.isConfirmed){
                SaveContentEdit(
                    document.getElementById("editId").value,
                    document.getElementById("editText").value,
                    document.getElementById("editType").value,
                    document.getElementById("editGoals").value
                );
            } else {
                Swal.fire('Changes are not saved') 
            }
        })
    }

    async function SaveContentEdit(id, text, type, goals){
        const {success, message, data } = await api({ func: 'EditQuestion', data: {id, text, type, goals}});
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        }
        
        const index = serverQuestionData.findIndex(serverQuestion => serverQuestion.id === data.id);
        if(index < 0) {
            Swal.fire({ title: 'Submit Failed', text: "Question Id Not Found", icon: 'error' });
            return false;
        }

        let copyQuestionData = [ ...serverQuestionData ];
        copyQuestionData[index] = data;
        setServerQuestionData(copyQuestionData);

        Swal.fire({title: 'Question Content Updated', text: 'Question Content Updated!', icon: 'success' });
        return(true);
    }
    async function OrderChange(id, priority, direction){
        const {success, message, data } = await api({ func: 'OrderChange', data: {id, priority, direction}});

        const index = serverQuestionData.findIndex(serverQuestion => serverQuestion.id === data.id);

        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        }
        
        let copyQuestionData = [ ...serverQuestionData ];
        copyQuestionData[index] = data;
       
        setServerQuestionData(copyQuestionData);
        window.location.reload();
        
    
    }

    async function ArchiveQuestion(id, status = true) {
        const { success, message, data } = await api({ func: 'ArchiveQuestion', data: { id, status }}); 
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        }

        const index = serverQuestionData.findIndex(serverQuestion => serverQuestion.id === data.id);
    
        if(index < 0) {
            Swal.fire({ title: 'Submit Failed', text: "Question Id Not Found", icon: 'error' });
            return false;
        }
  
        let copyQuestionData = [ ...serverQuestionData ];
        copyQuestionData[index] = data;
   
        setServerQuestionData(copyQuestionData);

        Swal.fire({title: 'Question Archive Status Updated', text: 'Question Archive Status Updated!', icon: 'success' });
        return(true);
    }

    async function AddQuestion (e) {
        const { value: question } = await Swal.fire({
            icon: "question",
            title: "Add Question",
            showCancelButton: true,
            html: 
                `<input id="AddQuestionText" class="swal2-input" value="Text">` +
                `<input id="AddQuestionGoals" class="swal2-input" value="Goal">` +
                `<select id="AddQuestionType" class="swal2-input">` +
                    `<option value="number">Number</option>` +
                    `<option value="note">Note</option>` +
                `</option>`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    text: document.getElementById('AddQuestionText').value,
                    type: document.getElementById('AddQuestionType').value
                }
            }
        });
        if (!question || !question.text || question.text.length <= 1) return;

        const { success, message: text, data } = await api({ func: 'AddQuestion', data: question })
        if(!success) {
            Swal.fire({ title: 'Add Question Failed', text, icon: 'error' });
            return;
        }
        const newQuestionData = [ data, ...serverQuestionData]
        setServerQuestionData(newQuestionData);
    }
    const cols = [ "Priority","Question Text", "Type", "Archived","Goals" ];
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Form - Edit Contents</h1>
            </div>
            <div className='card-body'>
                <div className="panel">
                    <table className='table table-hover table-striped'>
                        <thead>
                            <tr>
                                <th></th>
                                {cols.map(e => <th key={uuid()}>{e}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {!serverQuestionData || serverQuestionData.length <= 0 ? (<tr><td colSpan={cols.length + 1}>No Questions Loaded</td></tr>) : 
                                serverQuestionData.map(({id, text, type, archived, goals, priority}) => 
                                    <tr key={`EditQuestion-${id}`}>
                                        <td>
                                            <Action type={ACTION_TYPES.EDIT} action={() => ToEdit(id, text, type, goals)} />
                                            <Action type={archived?ACTION_TYPES.RES:ACTION_TYPES.DEL} action={() => ArchiveQuestion(id, !archived)} />
                                            <button className='btn btn-outline-primary w-100' onClick={() => OrderChange(id, priority+1, '+')}>+</button>
                                            {priority > 1 && <button className='btn btn-outline-primary w-100' onClick={() => OrderChange(id, priority-1, '-')}>-</button>}
                                        </td>
                                        <td>{priority}</td>
                                        <td>{text}</td>
                                        <td>{type}</td>
                                        <td className={archived?'text-danger':'text-success'}>
                                            {archived ? "" : "Not "} Archived
                                        </td>
                                        <td>{goals}</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td colSpan={cols.length + 1}>
                                    <button className='btn btn-outline-primary w-100' onClick={AddQuestion}>Add Question</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}




export default FormEdit
