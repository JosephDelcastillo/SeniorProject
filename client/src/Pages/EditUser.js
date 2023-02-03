import React from 'react';
import Swal from 'sweetalert2';
import UserForm from '../Components/UserForm';
import { useParams } from 'react-router-dom';

const inputByID = (id) => document.getElementById(id).value;
 
/**
 * Create New User Page
 * @returns {React.Component}
 */
function EditUser({ getToken, api }) {
    let {email} = useParams();
   
    const handleSubmit = async e => {
        e.preventDefault();
        let data = {
            "name": inputByID("emplName"),
            "oldemail": email,
            "type": inputByID("accType"),
            "email": inputByID("emplEmail")
        };

        //Sends info to database to create user
        const { success } = await api({ func: 'EditUser', data});
        if(success) {
            console.log(success);

            Swal.fire({title: "User Updated Successfully!", icon: 'success'}).then(function() {
                //TODO: check if email was valid and was successfully updated (if yes, send new email)
                //If not, keep old email
                window.location = `/dashboard/user/${data.email ? data.email : email}`;
            });
        } else {
            Swal.fire({title: "Could Not Update User", icon: 'error'})
        }
 
    }
 
    return (
        <div className="card m-2 mt-5 border-none">
        <div className="text-center">
        <h1>Edit User Account</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
        </div>
 
        <div className="card-body text-center">
            <UserForm handleSubmit={handleSubmit} user={email}/>
        </div>
 
        </div>
    )
}
 
export default EditUser