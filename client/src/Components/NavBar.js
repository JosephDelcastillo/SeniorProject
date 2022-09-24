import React from 'react'
import { Link } from 'react-router-dom' 

import logo from '../Media/janfl-logo_banner.png'; 

function NavBar({ getToken }) {
    return (
        <nav className='navbar navbar-expand-lg'>
            <div className='container-fluid mx-2'>
                <Link className='navbar-brand' to='/'>
                    <img src={logo} alt="JANFL" height='50px' />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" 
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {( getToken() ) ? ( 
                    <div className="navbar-nav">
                        <Link className='nav-link' to="dashboard">Dashboard</Link>
                        <Link className='nav-link' to="logout">Logout</Link>
                    </div>
                ):(
                    <div className="navbar-nav">
                        {/* <Link className='nav-link' to="login">Login</Link> */}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar 