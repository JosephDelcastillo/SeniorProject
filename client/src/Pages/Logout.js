import React from 'react'


/**
 *  Logout Page
 * 
 *  Manages Logging Out  
 * @returns {React.Component} 
 */
function Logout({ resetToken }) {
    resetToken();
    return (
        <div className='row' onLoad={window.location.pathname = ""}>
            <div className='col-12 text-center p-5'>
                <h1> Logout </h1>
            </div>
        </div>
    )
}

export default Logout