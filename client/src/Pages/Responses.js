import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */


function Responses({api}) {
    const [entryData, setEntryData] = useState([{}]);

    const deleteSubmission = async id => {
        let newEntryData = { ...entryData };
        const dataIndex = newEntryData.submissions.findIndex(submission => submission.id = id);
        if(dataIndex < 0) return Swal.fire({title: 'Failed to Archive Submission', text: `Can Not Find Submission Id: ${id}` , icon: 'error'});
        console.log("DataIndex is > 0", dataIndex);
        const apiOutput = await api({func: "ArchiveSubmissions", data: {submissionId: id, archiveStatus: true}});
        console.log("apiOutput is: ", apiOutput);
        if(!apiOutput || !apiOutput.success) return Swal.fire({title: 'Failed to Archive Submission', text: !apiOutput.message ? 'API Query Failed' : apiOutput.message , icon: 'error'});
        if(!apiOutput.data.id || newEntryData.submissions[dataIndex].id !== apiOutput.data.id) return Swal.fire({title: 'Error Archiving Submission', text: `Submission Id "${id}" Does Not Match Received Submission Id "${apiOutput.data.id}"` , icon: 'error'});
        console.log("NewEntryData.submissions[dataIndex]", newEntryData.submissions[dataIndex]);
        newEntryData.submissions[dataIndex] =  apiOutput.data;
        console.log("New Entry Data Before", newEntryData.submissions[dataIndex]);
        setEntryData(newEntryData);
        console.log("New Entry Data After", newEntryData.submissions[dataIndex]);
        //TO DO: TRIGGER API CALL, IF SUCCESSFUL SET ENTRYDATA TO API RESULT
    }

    useEffect(() => {
        api({func: "GetAllSubmissions", data: "test"}).then(({success, data}) => {
            if(success){
                setEntryData(data);
            }
            
        })
    }, [api,setEntryData]);

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses - My Responses</h1>
            </div>
            <div className='card-body'>
                <hr />
               {(entryData && entryData.submissions && entryData.users)? (
                <div className="panel">
                <table className="table tableHover">
                    <thead>
                        <tr>
                            <th scope ="col" width="120px">&nbsp;</th>
                            <th scope = "col">Email</th>
                            <th scope = "col">Date</th>
                            <th scope = "col">Modified By</th>
                            <th scope = "col">Modified Date</th>
                            <th schope = "col">Archived?</th>
                        </tr>                        
                    </thead>
                    <tbody>
                        {entryData.submissions.map(submit => (
                
                            <tr key={submit.id}>
                                <td>
                                    <i className="fa-regular fa-eye text-info pe-1 c-pointer" onClick={() => {window.location.pathname = "/dashboard/response/"+ submit.id}}></i>
                                    <i className="fa-regular fa-trash-can text-danger pe-1 c-pointer" onClick={()=>deleteSubmission(submit.id)}></i>
                                </td>
                                <td>{entryData.users.find(u => (u.id === submit.user)).email}</td>
                                <td>{submit.created}</td>
                                <td>{(!submit.modified_by)?("Not Modified"):(entryData.users.find(u => (u.id === submit.modified_by)).email)}</td>
                                <td>{!submit.modified?("Not Modified"):(submit.modified)}</td>
                                <td>{!submit.archived?("No"):("Yes")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
               ):(<></>)}
            </div>
        </div>
    )
}
export default Responses