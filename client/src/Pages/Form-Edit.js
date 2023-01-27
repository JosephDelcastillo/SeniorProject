
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
//import changeArchiveStatus from '../../../api/changeArchiveStatus';



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
    const tableStyle = {
        border: 'solid',
        padding: '1.5em',

    }

    useEffect(() => {
        api({func: "GetQuestion", data: { search:"" } }).then(result => setServerQuestionData(result.data))

    },[setServerQuestionData,api]);

    async function ToEdit(id, text, type){
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
        <label>Response Type
        <br/>
        <select id="editType">
            <option value="number"> Number </option>
            <option value="note"> Text </option>
        </select>
    </label>
    <br/>`
        
    }).then((result) =>{
        if(result.isConfirmed){
            SaveContentEdit(document.getElementById("editId").value,document.getElementById("editText").value,document.getElementById("editType").value);
        } else {
            Swal.fire('Changes are not saved') 
        }
    })
    }

    async function SaveContentEdit(id, text, type){
        const {success, message, data } = await api({ func: 'EditQuestion', data: {id, text, type}});
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

            document.getElementById("editId").value = "";
            document.getElementById("editText").value = "";
            document.getElementById("editType").value =  "";

        return(true);
    }


    async function ArchiveQuestion(id, status = true) {
        const { success, message, data } = await api({ func: 'ArchiveQuestion', data: { id, status }}); 
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        }

        const index = serverQuestionData.findIndex(serverQuestion => serverQuestion.id === data.id);
        console.log(index);
        if(index < 0) {
            Swal.fire({ title: 'Submit Failed', text: "Question Id Not Found", icon: 'error' });
            return false;
        }
        console.log(index);
        let copyQuestionData = [ ...serverQuestionData ];
        copyQuestionData[index] = data;
        console.log(serverQuestionData,copyQuestionData);
        setServerQuestionData(copyQuestionData);
        console.log(serverQuestionData);
        Swal.fire({title: 'Question Archive Status Updated', text: 'Question Archive Status Updated!', icon: 'success' });
        return(true);
    }

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Form - Edit Contents</h1>
            </div>
            <h2>Active Questions</h2>
            <div className='card-body'>
                <div className="panel">
                   <table>
                        <thead>
                            <tr>
                                <th style={tableStyle}>ID</th>
                                <th style={tableStyle}>Question Text</th>
                                <th style={tableStyle}>Type</th>
                                <th style={tableStyle}>Archive</th>
                                <th style={tableStyle}>Edit</th>

                            </tr>
                        </thead>
                        <tbody>
                            {serverQuestionData.map(({id,text,type,archived,goal}) => 
                                    <tr key={`EditQuestion-${id}`}>
                                        <td style={tableStyle}>{id}</td>
                                        <td style={tableStyle}>{text}</td>
                                        <td style={tableStyle}>{type}</td>
                                        <td>
                                            <button className='btn btn-success' type="button" 
                                                onClick={() => {ArchiveQuestion(id,!archived)}}>
                                                {archived ? "Unarchive" : "Archive"}
                                            </button>
                                        </td>
                                        <td>
                                           <button className='btn btn-success' type="button" onClick={() => ToEdit(id,text,type)}>
                                            Edit Question Content
                                            </button> 
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                   </table>
                </div>
            </div>
        </div>
    )
}




export default FormEdit