import React, { useState } from 'react';
import Swal from 'sweetalert2';
import UserForm from '../Components/UserForm';
import { useParams } from 'react-router-dom';

const inputByID = (id) => document.getElementById(id).value;

/**
 * Create New User Page
 * @returns {React.Component}
 */
function NewUser({ getToken, api }) {
   
    const handleSubmit = async e => {
        e.preventDefault();
        let data = {
            "name": inputByID("emplName"),
            "password": inputByID("emplPass"),
            "type": inputByID("accType"),
            "email": inputByID("emplEmail")
        };

        //Sends info to database to create user
            const { success } = await api({ func: 'UserCreate', data});
            if(success) {
                Swal.fire({title: "User Created Successfully!", icon: 'success'}).then(function() {
                    window.location = "/dashboard/user";
                });
                console.log(success);
            } else {
                Swal.fire({title: "Could Not Create User", icon: 'error'})
            }
    }
 
    return (
        <div className="card m-2 mt-5 border-none">
        <div className="text-center">
        <h1>Create New User Account</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
        </div>
 
        <div className="card-body text-center">
        <UserForm handleSubmit={handleSubmit}/>
        </div>
 
        </div>
    )
}
 
export default NewUser
