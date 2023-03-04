import React from 'react';
import Swal from 'sweetalert2';

const inputByID = (id) => document.getElementById(id).value;
 
/**
 * Create New User Page
 * @returns {React.Component}
 */
function EditProfile({ getToken, api }) {
   
    const handleSubmit = async e => {
        e.preventDefault();
        let data = {
            "name": inputByID("emplName"),
            "email": inputByID("emplEmail"),
            "password": inputByID("userpass"),
            "password2": inputByID("userpass2")
        };

        //Sends info to database to create user
        const { success } = await api({ func: 'EditCurrentUser', data});
        if(success) {
            console.log(success);

            Swal.fire({title: "Profile Updated Successfully!", icon: 'success'}).then(function() {
                //TODO: check if email was valid and was successfully updated (if yes, send new email)
                //If not, keep old email
                window.location = "/dashboard/profile";
            });
        } else {
            Swal.fire({title: "Could Not Update Profile", icon: 'error'})
        }
 
    }
 
    return (
        <div className="card m-2 mt-5 border-none">
        <div className="text-center">
        <h1>Edit Profile</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
        </div>
 
        <div className="card-body text-center">
        <form onSubmit={handleSubmit}>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplName" className="form-label">Employee Name:</label>
                <input type="text" id="emplName" name="emplName" placeholder="John Doe" className="form-control"></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplEmail" className="form-label">Employee Email:</label>
                <input type="email" id="emplEmail" name="emplEmail" placeholder="123@email.com" className="form-control"></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="userpass" className="form-label">New Password:</label>
                <input type="password" id="userpass" name="userpass" className="form-control"></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="userpass2" className="form-label">Confirm Password:</label>
                <input type="password" id="userpass2" name="userpass2" className="form-control"></input>
            </div>
            <button className="btn btn-outline-primary col-3 mt-5" type="submit"> Save </button>
            <a href="/dashboard/profile" type='button' className="btn btn-outline-primary col-3 mt-5"> Cancel </a>
        </form>
        </div>
 
        </div>
    )
}
 
export default EditProfile