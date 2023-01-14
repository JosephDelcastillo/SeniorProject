import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * User Page
 * @returns {React.Component}
 */
function UserPage({ getToken, api }) {
    let {email} = useParams();
    const [user, setUser] = useState({});
    //getUser();

    //Grabs user data from database
    useEffect( () => {
        api({ func: 'GetUsers', data: {"search": email}}).then( ({success, data}) => {
            if (success) {
                console.log(data[0]);
                setUser(data[0]);
            }
        });
    }, [setUser, api] )

    //TODO:Connect the buttons to things
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

            <div className="text-center">
                    <a className='btn btn-outline-primary col-3 mt-5' href={`/dashboard/edituser/${email ? email : ""}`}> Edit </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Archive Account </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Reset Password </a>
            </div>

        </div>
    )
}
 
export default UserPage