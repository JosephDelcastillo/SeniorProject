import React, { useEffect, useState } from 'react';

/**
 * User Page
 * @returns {React.Component}
 */
function Profile({ getToken, api }) {
    const [user, setUser] = useState({});

    //Grabs user data from database
    useEffect( () => {
        api({ func: 'GetCurrentUser', data: ""}).then( ({success, data}) => {
            if (success) {
                console.log(data[0]);
                setUser(data[0]);
            }
        });
    }, [setUser, api] )

    //TODO:Connect the button to edit
    return (
        <div className="card m-2 mt-5 border-none">
            <div>
                <div className="card-header bg-white text-center">
                <h1>{user.name ? user.name : "User not Found"}</h1>
                </div>
                <h3 className="card-body bg-white text-center">Email: {user.email ? user.email : "No Email"}</h3>
                <h3 className="card-body bg-white text-center">Account Type: {user.type ? user.type : "No User Type"}</h3>
            </div>

            <div className="text-center">
                    <label className='btn btn-outline-primary col-3 mt-5'> Edit Profile </label>
            </div>
        </div>
    )
}
 
export default Profile