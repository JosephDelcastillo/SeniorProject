import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

/**
 * User Page
 * @returns {React.Component}
 */
function UserPage({ getToken, api }) {
    let { email } = useParams();
    const [user, setUser] = useState({});

    //Grabs user data from database
    useEffect( () => {
        api({ func: 'GetUsers', data: {"search": email}}).then( ({success, data}) => {
            if (success) {
                setUser(data[0]);
            }
        });
    }, [setUser, api, email] )

    const handleArchive = async e => {
        e.preventDefault();
        let data = {
            "email": email,
            "archive": false
        };

        const { success } = await api({ func: 'ArchiveUser', data});
        if(success) {

            Swal.fire({title: "User Archived Successfully!", icon: 'success'}).then(function() {
                window.location = `/dashboard/user/${email}`;
            });
        } else {
            Swal.fire({title: "Could Not Archive User", icon: 'error'})
        }
    }

    const handleUnArchive = async e => {
        e.preventDefault();
        let data = {
            "email": email,
            "archive": true
        };

        const { success } = await api({ func: 'ArchiveUser', data});
        if(success) {

            Swal.fire({title: "User Unarchived Successfully!", icon: 'success'}).then(function() {
                window.location = `/dashboard/user/${email}`;
            });
        } else {
            Swal.fire({title: "Could Not Unarchived User", icon: 'error'})
        }
    }

    const handleReset = async e => {
        e.preventDefault();
        let data = {
            "email": email
        };

        const { success } = await api({ func: 'ForgotPassword', data});
        if(success) {

            Swal.fire({title: "Reset Email Sent Successfully!", icon: 'success'})
        } else {
            Swal.fire({title: "Could Not Send Reset Email", icon: 'error'})
        }
    }

    return (
        <div className="card m-2 mt-5 border-none">
            <div>
                <div className="card-header bg-white text-center">
                <h1>{user.name ? user.name : "No User"}</h1>
                </div>
                <h3 className="card-body bg-white text-center">Email: {email ? email : "No Email"}</h3>
                <h3 className="card-body bg-white text-center">Account Type: {user.type ? user.type : "No User"}</h3>
                <h3 className="card-body bg-white text-center">Archived: {typeof user.archived !== "undefined" ? (user.archived ? "true" : "false") : "No User"}</h3>
            </div>

            {!user.archived ? <div className="text-center">
                    <a className='btn btn-outline-primary col-3 mt-5' href={`/dashboard/edituser/${email ? email : ""}`}> Edit </a>
                    <button className='btn btn-outline-primary col-3 mt-5' onClick={handleArchive}> Archive Account </button>
                    <button className='btn btn-outline-primary col-3 mt-5' onClick={handleReset}> Reset Password </button>
            </div>
            : <div className="text-center">
            <button className='btn btn-outline-primary col-3 mt-5' onClick={handleUnArchive}> UnArchive Account </button>
            </div>}
        </div>
    )
}
 
export default UserPage