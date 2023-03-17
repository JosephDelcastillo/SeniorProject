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
console.log(api)
    useEffect(() => {
        api({func: "GetAllSubmissions", data: "All"}).then(({success, data}) => {
            if(!success) return Swal.fire({ title: 'Get Responses Failed', icon: 'error' });
            const columns = [
                { cell: row => row.actions, width: '4rem' },
                //{ name: 'id', selector: row=> row.id, sortable: true },
                { name: 'User', selector: row => row.user, sortable: true }, 
                { name: 'Created', selector: row => row.created, sortable: true }, 
                { name: 'Modified By', selector: row => row.modified_by, sortable: true }, 
                { name: 'Last Edit Date', selector: row => row.modified, sortable: true },
                { name: 'Archived?', selector: row => row.archived, sortable: true }
            ];
            let info = [];
            console.log(data.submissions);
            console.log(info);

            function createModified (status){
                return (status && status.length > 1) ? status : 'Not Modified';
            }
            function createModifiedBy ( by ) {
                const search = data.users.findIndex(u => u.id === by);
                return (search >= 0) ? data.users[search].name : 'Not Modified';
            }
            function createActions ({ id, archived }) {
                return (<>
                        <Action key={uuid()} 
                            type={ACTION_TYPES.VIEW} 
                            action={() => {window.location.pathname = `/dashboard/response/${id}`}} />
                        <Action key={uuid()}
                            type={(archived === "Yes" || archived === true) ? ACTION_TYPES.RES : ACTION_TYPES.DEL}
                            action={e => archiveHandler(id)} />
                    </>);
            }

            data.submissions.forEach(({ id, user, created, modified, modified_by, archived}, i) => {
                let search = data.users.findIndex(u => u.id === user);
                user = (search >= 0) ? data.users[search].name : user;
                console.log("User: ", data.users[search]);
                
                created = (created && created.length > 1) ? created : 'Unknown';
                archived = (!archived) ? "No" : "Yes";
                modified = createModified(modified);
                modified_by = createModifiedBy(modified_by);
                const actions = createActions({ id, archived });

                info.push({ id, user, created, modified, modified_by, archived, actions })
            });
            
            const tables = { info, columns };
            
            //*****Archive Handler Checks Archive Status of a Submission and Allows User to Archive/Unarchive that Submission******/
            async function archiveHandler (id) {
                let newEntryData = { tables, ...data };

                //Find index of selected submission in array
                console.log(newEntryData.tables.info);
                const dataIndex = newEntryData.tables.info.findIndex(submission => submission.id === id);
                console.log("Data Index: ", dataIndex);
                
                //Check that requested submissions exists
                if(dataIndex < 0) return Swal.fire({title: 'Failed to Archive Submission', text: `Can Not Find Submission Id: ${id}` , icon: 'error'});
                
                //Check to see if submission needs to be archived or unarchived and set new value to that value
                const oldStatus = newEntryData.tables.info[dataIndex].archived;
                const newStatus = (oldStatus === false || oldStatus === "No") ? true : false;
                
                //Pass request to function in API
                const apiOutput = await api({func: "ArchiveSubmissions", data: {submissionId: id, archiveStatus: newStatus}});
                
                //Check for database query success
                if(!apiOutput || !apiOutput.success) return Swal.fire({title: 'Failed to Archive Submission', text: !apiOutput.message ? 'API Query Failed' : apiOutput.message , icon: 'error'});
                
                //Check for status change success
                if(!apiOutput.data.id || newEntryData.tables.info[dataIndex].id !== apiOutput.data.id) return Swal.fire({title: 'Error Archiving Submission', text: `Submission Id "${id}" Does Not Match Received Submission Id "${apiOutput.data.id}"` , icon: 'error'});
                
                //If all events successful, then update the submission data and update page
                newEntryData.tables.info[dataIndex].actions = createActions(apiOutput.data);
                newEntryData.tables.info[dataIndex].archived = apiOutput.data.archived ? 'Yes' : 'No';
                newEntryData.tables.info[dataIndex].modified = createModified(apiOutput.data.modified);
                newEntryData.tables.info[dataIndex].modified_by = createModifiedBy(apiOutput.data.modified_by);
            
                
                Swal.fire({title: 'Submission Updated', text: `Submission Updated` , icon: 'success'}) //.then(function() {window.location.reload()});
                console.log(newEntryData);
                setEntryData(newEntryData);
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