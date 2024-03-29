import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { v4 as uuid } from 'uuid'

import Action, { ACTION_TYPES } from '../Components/Action'
import Table from '../Components/Table'
/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */
function Responses({api}) {
    const [entryData, setEntryData] = useState([{}]);
    useEffect(() => {
        api({func: "GetAllSubmissions", data: "All"}).then(({success, data}) => {                               //Default state set by calling GetAllSubmissions from backend
            if(!success) return Swal.fire({ title: 'Get Responses Failed', icon: 'error' });                    //Fail condition
            const columns = [
                { cell: row => row.actions, width: '4rem' },
                //{ name: 'id', selector: row=> row.id, sortable: true },
                { name: 'User', selector: row => row.user, sortable: true, searchable: true },                 //Set up table with sortable rows
                { name: 'Created', selector: row => row.created, sortable: true }, 
                { name: 'Modified By', selector: row => row.modified_by, sortable: true, searchable: true }, 
                { name: 'Last Edit Date', selector: row => row.modified, sortable: true },
                { name: 'Archived?', selector: row => row.archived, sortable: true }
            ];
            let info = [];
            function createModified (status){                                                                  //Checks for and returns the modified value of a response
                return (status && status.length > 1) ? status : 'Not Modified';
            }
            function createModifiedBy ( by ) {                                                                 //Checks for and returns the modified_by value of a response
                const search = data.users.findIndex(u => u.id === by);
                return (search >= 0) ? data.users[search].name : 'Not Modified';
            }
            function createActions ({ id, archived }) {                                                       //Checks whether or not a submission is archived or not and determines which icon to display
                return (<>
                        <Action key={uuid()} 
                            type={ACTION_TYPES.VIEW}                                                          //Always provide option to view response
                            action={() => {window.location.pathname = `/dashboard/response/${id}`}} />
                        <Action key={uuid()}
                            type={(archived === "Archived" || archived === true) ? ACTION_TYPES.RES : ACTION_TYPES.DEL} //Checks archival status and displays proper icon.
                            //Call archiveHandler function on button click
                            action={e => archiveHandler(id)} />                                                         
                    </>);
            }
            //Creates table for each submission. 
            data.submissions.forEach(({ id, user, created, modified, modified_by, archived}, i) => {
                let search = data.users.findIndex(u => u.id === user);
                user = (search >= 0) ? data.users[search].name : user;  
                created = (created && created.length > 1) ? created : 'Unknown';
                archived = (!archived) ? "Not Archived" : "Archived";
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
                const dataIndex = newEntryData.tables.info.findIndex(submission => submission.id === id);
                
                //Check that requested submissions exists
                if(dataIndex < 0) return Swal.fire({title: 'Failed to Archive Submission', text: `Can Not Find Submission Id: ${id}` , icon: 'error'});
                
                //Check to see if submission needs to be archived or unarchived and set new value to that value
                const oldStatus = newEntryData.tables.info[dataIndex].archived;
                const newStatus = (oldStatus === false || oldStatus === "Not Archived") ? true : false;
                
                //Pass request to function in API
                const apiOutput = await api({func: "ArchiveSubmissions", data: {submissionId: id, archiveStatus: newStatus}});
                
                //Check for database query success
                if(!apiOutput || !apiOutput.success) return Swal.fire({title: 'Failed to Archive Submission', text: !apiOutput.message ? 'API Query Failed' : apiOutput.message , icon: 'error'});
                
                //Check for status change success
                if(!apiOutput.data.id || newEntryData.tables.info[dataIndex].id !== apiOutput.data.id) return Swal.fire({title: 'Error Archiving Submission', text: `Submission Id "${id}" Does Not Match Received Submission Id "${apiOutput.data.id}"` , icon: 'error'});
                
                //If all events successful, then update the submission data and update page
                newEntryData.tables.info[dataIndex].actions = createActions(apiOutput.data);
                newEntryData.tables.info[dataIndex].archived = apiOutput.data.archived ? 'Archived' : 'Not Archived';
                newEntryData.tables.info[dataIndex].modified = createModified(apiOutput.data.modified);
                newEntryData.tables.info[dataIndex].modified_by = createModifiedBy(apiOutput.data.modified_by);
            
                
                Swal.fire({title: 'Submission Updated', text: `Submission Updated` , icon: 'success'}) 
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
                {(!entryData || !entryData.tables || !entryData.tables.info || !entryData.tables.columns)?(<></>):(
                    <Table key={uuid()} columns={entryData.tables.columns} data={entryData.tables.info}  />
                )}
            </div>
        </div>
    )
}
export default Responses