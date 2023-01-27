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
            function deleteSubmission (id) {
                let newEntryData = { tables, ...data };
                newEntryData.tables.info = newEntryData.tables.info.filter(s => s.id !== id);
                setEntryData(newEntryData);
                //TO DO: TRIGGER API CALL, IF SUCCESSFUL SET ENTRYDATA TO API RESULT
                // window.location.reload()
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