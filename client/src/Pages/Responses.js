import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { v4 as uuid } from 'uuid'

import Action, { ACTION_TYPES } from '../Components/Action'
import Table from '../Components/Table';

/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */
function Responses({api}) {
    const [entryData, setEntryData] = useState([{}]);

    useEffect(() => {
        api({func: "GetAllSubmissions", data: "All"}).then(({success, data}) => {
            if(!success) return Swal.fire({ title: 'Get Responses Failed', icon: 'error' });
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
                    <Action key={uuid()} type={ACTION_TYPES.VIEW} action={() => {window.location.pathname = `/dashboard/response/${id}`}} />
                    <Action key={uuid()} type={ACTION_TYPES.DEL} action={e => deleteSubmission(id)} />
                </>)

                info.push({ id, user, created, modified, modified_by, actions })
            });
            
            const tables = { info, columns };
            async function deleteSubmission (id) {
                let newEntryData = { tables, ...data };

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
            }

            setEntryData({ tables, ...data });
        })
    }, [api]);

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses </h1>
            </div>
            <div className='card-body'>
                <hr />
                {(!entryData || !entryData.tables || !entryData.tables.info || !entryData.tables.columns)?(<></>):(
                    <Table key={uuid()} columns={entryData.tables.columns} data={entryData.tables.info}  />
                )}
            </div>
        </div>
    )
}
export default Responses