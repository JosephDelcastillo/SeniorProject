import React from 'react'
import { Link } from 'react-router-dom' 

import logo from '../Media/janfl-logo_banner.png'; 

function NavBar({ getToken, isAdmin }) {
    return (
        <nav className='navbar navbar-expand-lg'>
            <div className='container-fluid mx-2 justify-content-between'>
                <Link className='navbar-brand' to={getToken()?'/dashboard':'/'}>
                    <img src={logo} alt="JANFL" height='50px' />
                </Link>
                {( getToken() ) && (<>
                    <Link className='btn btn-success rounded-pill' to="dashboard/form">{(isAdmin())?('Manage Form'):('New Response +')}</Link>
                    <div className="navbar-nav">
                        {(isAdmin())?(<>
                            <div className='nav-item dropdown'>
                                <Link className='nav-link dropdown-toggle' role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Users
                                </Link>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><Link className='dropdown-item' to="dashboard/users">Manage Users</Link></li>
                                    <li><Link className='dropdown-item' to="dashboard/newuser">Add User</Link></li>
                                </ul>
                            </div>
                            <div className='nav-item dropdown'>
                                <Link className='nav-link dropdown-toggle' role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Responses
                                </Link>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><Link className='dropdown-item' to="dashboard/responses">Manage Responses</Link></li>
                                    <li><Link className='dropdown-item' to="dashboard/addResponse">Add Response</Link></li>
                                </ul>
                            </div>
                        </>):(<>
                            <Link className='nav-link' to="dashboard/responses">Responses</Link>
                        </>)}
                        <Link className='nav-link' to="dashboard/report">Reports</Link>
                        <div className='nav-item dropdown'>
                            <Link className='nav-link dropdown-toggle' role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Profile
                            </Link>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><Link className='dropdown-item' to="profile">Your Profile</Link></li>
                                <li><Link className='dropdown-item' to="logout">Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </>)}
            </div>
        </nav>
    )
}

export default NavBar 