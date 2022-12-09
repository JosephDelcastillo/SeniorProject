import React, { useState, useEffect } from 'react'

/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */


function Responses({api}) {
    const [entryData, setEntryData] = useState([{}]);

    const deleteSubmission = id => {
        const newEntryData = {users: entryData.users, submissions: entryData.submissions.filter(s => s.id !== id)};
        setEntryData(newEntryData);
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
                <h1> Responses </h1>
            </div>
            <div className='card-body'>
                <hr />
               {(entryData && entryData.submissions && entryData.users)? (
                <div className="panel">
                <table className="table tableHover">
                    <thead>
                        <tr>
                            <th scope ="col" width="180px">&nbsp;</th>
                            <th scope = "col">Email</th>
                            <th scope = "col">Date</th>
                            <th scope = "col">Modified By</th>
                            <th scope = "col">Modified Date</th>
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
                                <td>{(submit.modified_by)?(entryData.users.find(u => (u.id === submit.modified_by)).email):("Not Modified")}</td>
                                <td>{submit.modified?(entryData.users.find(u => (u.id === submit.modified_by)).email):("Not Modified")}</td>
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