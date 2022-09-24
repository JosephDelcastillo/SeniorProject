import React from 'react';

function Home() {

    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Employee Progress Outcome Tracking System </h1>
            </div>
            <br />
            <div className='card-body text-center'>
                <a href='/login' className='btn btn-light'>
                    <h3>
                        Click to Login
                    </h3>
                </a>
            </div>
        </div>
    )
}

export default Home