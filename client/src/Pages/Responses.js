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
                { name: 'Modified By', selector: row => row.modified_by, sortable: true }, 
                { name: 'Last Edit Date', selector: row => row.modified, sortable: true },
                { name: 'Archived?', selector: row => row.archived, sortable: true }
            ];
            let info = [];
            data.submissions.forEach(({ id, user, created, modified, modified_by, archived}, i) => {
                let search = data.users.findIndex(u => u.id === user);
                user = (search >= 0) ? data.users[search].name : user;
                console.log("User: ", data.users[search].email);
                created = (created && created.length > 1) ? created : 'Unknown';
                archived = (!archived) ? "No" : "Yes";
                search = data.users.findIndex(u => u.id === modified_by);
                modified = (modified && modified.length > 1) ? modified : 'Not Modified';
                modified_by = (search >= 0 && created !== modified) ? data.users[search].name : 'Not Modified';
                
                const actions = (
                <>
                    <Action key={uuid()} type={ACTION_TYPES.VIEW} action={() => {window.location.pathname = `/dashboard/response/${id}`}} />
                    <Action key={uuid()} type={(archived === "Yes") ? ACTION_TYPES.RES : ACTION_TYPES.DEL} action={e => archiveHandler(id)} />
                </>)

                info.push({ id, user, created, modified, modified_by, archived, actions })
            });
            
            const tables = { info, columns };
            //*****Archive Handler Checks Archive Status of a Submission and Allows User to Archive/Unarchive that Submission******/
            async function archiveHandler (id) {
                let newEntryData = { tables, ...data };

                //Find index of selected submission in array
                const dataIndex = newEntryData.submissions.findIndex(submission => submission.id = id);
               //Check that requested submissions exists
                if(dataIndex < 0) return Swal.fire({title: 'Failed to Archive Submission', text: `Can Not Find Submission Id: ${id}` , icon: 'error'});
                //Check to see if submission needs to be archived or unarchived and set new value to that value
                const newStatus = (data.submissions[0].archived === false)? true : false;
                //Pass request to function in API
                const apiOutput = await api({func: "ArchiveSubmissions", data: {submissionId: id, archiveStatus: newStatus}});
                //Check for database query success
                if(!apiOutput || !apiOutput.success) return Swal.fire({title: 'Failed to Archive Submission', text: !apiOutput.message ? 'API Query Failed' : apiOutput.message , icon: 'error'});
                //Check for status change success
                if(!apiOutput.data.id || newEntryData.submissions[dataIndex].id !== apiOutput.data.id) return Swal.fire({title: 'Error Archiving Submission', text: `Submission Id "${id}" Does Not Match Received Submission Id "${apiOutput.data.id}"` , icon: 'error'});
                //If all events successful, then update the submission data and update page
                newEntryData.submissions[dataIndex] =  apiOutput.data;
                

                setEntryData(newEntryData);
                //TO DO: REPLACE WITH PROPER STATE UPDATES
                window.location.reload();
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