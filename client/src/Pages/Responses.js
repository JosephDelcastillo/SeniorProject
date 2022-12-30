import React, { useState, useEffect } from 'react'
import Table from '../Components/Table';

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
                const columns = [
                    { cell: row => row.actions, width: '4rem' },
                    { name: 'User', selector: row => row.user, sortable: true }, 
                    { name: 'Created', selector: row => row.created, sortable: true }, 
                    { name: 'Modified', selector: row => row.modified, sortable: true }, 
                    { name: 'Modified By', selector: row => row.modified_by, sortable: true }
                ];
                let info = [];
                data.submissions.forEach(({ id, user, created, modified, modified_by }, i) => {
                    let search = data.users.findIndex(u => u.id === user);
                    user = (search >= 0) ? data.users[search].email : user;
                    created = (created && created.length > 1) ? created : 'Unknown';
                    
                    search = data.users.findIndex(u => u.id === modified);
                    modified = (search >= 0) ? data.users[search].email : 'Not Modified';
                    modified_by = (modified_by && modified_by.length > 1) ? modified_by : 'Not Modified';
            
                    const actions = (
                    <>
                        <i className="fa-regular fa-eye text-info pe-1 c-pointer" onClick={() => {window.location.pathname = `/dashboard/response/${id}`}}></i>
                        <i className="fa-regular fa-trash-can text-danger pe-1 c-pointer" onClick={() => deleteSubmission(id)}></i>
                    </>)
            
                    info.push({ id, user, created, modified, modified_by, actions })
                });
                
                console.log({ info, columns })
                const tables = { info, columns };
                setEntryData({ tables, ...data });
            }
            
        })
    }, [api, setEntryData]);

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses </h1>
            </div>
            <div className='card-body'>
                {(entryData && entryData.submissions && entryData.users)? (
                <Table columns={entryData.tables.columns} data={entryData.tables.info} />
                ):(<></>)}
            </div>
        </div>
    )
}
export default Responses