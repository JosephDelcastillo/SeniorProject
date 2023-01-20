import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        api({func: "GetUsers", data: {"search": ""}}).then(({success, data}) => {
            console.log("What we got back");
            console.log(success);
            console.log(data);

            if(success){
                setUserData(data);
                console.log("User data set to:");
                console.log(userData);
            }
            
        })
    }, [api,setUserData]);


    return (
        <div className="card m-2 mt-5 border-none">
        <div className="card-header bg-white text-center">
        <h1>Users</h1>
        </div>
 
        <div className="panel">
                <table className="table tableHover">
                    <thead>
                        <tr>
                            <th scope="col" width="60px"></th>
                            <th scope="col">Name <button>&#9660;</button></th>
                            <th scope="col">Email <button>&#9660;</button></th>
                            <th scope="col">Account Type <button>&#9660;</button></th>
                            <th scope="col">Archival Status <button>&#9660;</button></th>
                        </tr>
                    </thead>
                    <tbody id="tableUsers">
                        {userData.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <i className="fa-regular fa-eye text-info pe-1 c-pointer" onClick={() => {viewUser(user.email)}}></i>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>{!user.archived?("False"):("True")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-center">
                <a href='/dashboard/newuser' className='btn btn-outline-primary col-3 mt-5'> Create New User </a>
            </div>

        </div>

    )
}
 
export default Users
