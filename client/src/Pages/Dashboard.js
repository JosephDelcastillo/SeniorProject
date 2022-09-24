import React from 'react';

/**
 * Dashboard Page 
 * @param {Function} parameters Get Logged In Token
 * @returns {React.Component} 
 */
function Dashboard({ getToken }) {
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Dashboard </h1>
            </div>
            <div className="card-body text-center">
                <p>
                    <a href='/dashboard/form' className='btn btn-light'> Form </a> <br />
                </p>
                <p>
                    <a href='/dashboard/responses' className='btn btn-light'> Responses </a> <br />
                </p>
                <p>
                    <a href='/dashboard/report' className='btn btn-light'> Report </a> <br />
                </p>
            </div>
        </div>
    )
}

export default Dashboard