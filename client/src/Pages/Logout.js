import React from 'react'


/**
 *  Logout Page
 * 
 *  Manages Logging Out  
 * @returns {React.Component} 
 */
function Logout({ resetToken, api }) {
    async function logoutfunc() {
         const {success}= await api({ func: 'Logout', data: {}});
         resetToken();
         window.location.pathname = "";
        }
    logoutfunc();
    return (
        <div className='row'>
            <div className='col-12 text-center p-5'>
                <h1> Logging out... </h1>
            </div>
        </div>
    )
}

export default Logout