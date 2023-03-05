import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid'
import Action, { ACTION_TYPES } from '../Components/Action'
import Table from '../Components/Table';

//Redirects to user page of specified user
function viewUser(userEmail) {
    //ToDo: Check if the the email matches the current user's email
    //If so, direct to profile page
    window.location = `/dashboard/user/${userEmail}`;
}
 
/**
 * Users Page
 * @returns {React.Component}
 */
function Users({ getToken, api }) {
    const [userData, setUserData] = useState([{}]);

    //TODO: Have it check the emails and direct you to the profile page if you click yourself

    useEffect(() => {
        api({func: "GetUsers", data: {"search": ""}}).then(({success, data}) => {
            if(success){
                const columns = [
                    { cell: row => row.actions, width: '60px' },
                    { name: 'Name', selector: row => row.name, sortable: true }, 
                    { name: 'Email', selector: row => row.email, sortable: true }, 
                    { name: 'Account Type', selector: row => row.type, sortable: true }, 
                    { name: 'Archival Status', selector: row => row.archived, sortable: true }
                ];

                let info = [];
                data.forEach(({ name, email, type, archived}, i) => {
                    archived = (!archived) ? "True" : "False";
                    
                    const actions = (
                    <>
                        <Action key={uuid()} type={ACTION_TYPES.VIEW} action={() => {viewUser(email)}} />
                    </>)

                    info.push({ name, email, type, archived, actions})
                });

                setUserData({info, columns}); 
            }
        })
    }, [api]);


    return (
        <div className="card m-2 mt-5 border-none">
        <div className="card-header bg-white text-center">
        <h1>Users</h1>
        </div>
 
        <div className="panel">
            {(!userData || !userData.info || !userData.columns)?(<></>):(
                    <Table key={uuid} columns={userData.columns} data={userData.info}  />
                )}
        </div>

            <div className="text-center">
                <a href='/dashboard/newuser' className='btn btn-outline-primary col-3 mt-5'> Create New User </a>
            </div>

        </div>

    )
}
 
export default Users
