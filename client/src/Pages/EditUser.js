import React, { useState } from 'react';
import Swal from 'sweetalert2';

//constants
const API_URL = (true) ? "https://epots-api.azurewebsites.net/api" : '/api';

 
/**
 * Create New User Page
 * @returns {React.Component}
 */
function EditUser({ getToken, api }) {
    let name = "";
    let role = "";
    let email = "";
   
    const handleSubmit = async e => {
        e.preventDefault();

        //Sends info to database to create user
        async function updateUser({name, role, email}) {
            const { success, data } = await api({ func: 'EditUser', data: {"name": name, "oldemail": sessionStorage.getItem("userEmail"), "type": role, "email": email}});
            if(success) {
                console.log(success);
                Swal.fire({title: "User Updated Successfully!", icon: 'success'}).then(function() {
                    window.location = "/dashboard/user";
                });
            } else {
                Swal.fire({title: "Could Not Update User", icon: 'error'})
                console.log(response);
            }
        }

        //Triggers the create user function to send data to the server and gets either a success or failure back
        let response = await updateUser({name, email, role});
 
    }
 
    return (
        <div className="card m-2 mt-5 border-none">
        <div className="text-center">
        <h1>Edit User Account</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
        </div>
 
        <div className="card-body text-center">
        <form onSubmit={handleSubmit}>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplName" className="form-label">Employee Name:</label>
                <input type="text" id="emplName" name="emplName" placeholder="John Doe" className="form-control" onChange={e => name = e.target.value}></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplEmail" className="form-label">Employee Email:</label>
                <input type="email" id="emplEmail" name="emplEmail" placeholder="123@email.com" className="form-control" onChange={e => email = e.target.value}></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="accType" className="form-label">Account Type:</label>
                <select name="accType" className="form-control" onClick={e => role = e.target.value}>
                    <option value="0">Select Account Type</option>
                    <option value="staff">Staff User</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
 
            <button className="btn btn-outline-primary col-3 mt-5" type="submit"> Save </button>
            <a href='/dashboard/user' type='button' className="btn btn-outline-primary col-3 mt-5"> Cancel </a>
        </form>
        </div>
 
        </div>
    )
}
 
export default EditUser