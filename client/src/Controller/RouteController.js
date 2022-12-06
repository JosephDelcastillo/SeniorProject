import React from 'react';
import { Routes, Route } from "react-router-dom";

import Dashboard from '../Pages/Dashboard';
import Responses from '../Pages/Responses';
import NotFound from '../Pages/NotFound';
import Logout from '../Pages/Logout';
import Report from '../Pages/Report';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Form from '../Pages/Form';
import NewUser from '../Pages/NewUser';

export default class RouteController extends React.Component {
    render() {
        return (
            <div className='container'> 
            <Routes>
                <Route path="/" element={<Home />} />
                {(this.props.getToken())?(<>
                    {(this.props.isAdmin())?(<>
                        <Route path="/dashboard/form" element={<Form getToken={this.props.getToken} />} /> {/* TODO: Replace this will Manage Form */}
                        <Route path="/dashboard/newuser" element={<NewUser getToken={this.props.getToken} />} />
                        {/* TODO: Add Manage Users */}
                        {/* TODO: Add Submit Form */}
                    </>):(<>
                        <Route path="/dashboard/form" element={<Form getToken={this.props.getToken} />} /> {/* TODO: Replace this will Submit Form */}
                    </>)}
                    <Route path="/logout" element={<Logout resetToken={this.props.resetToken} />} />
                    <Route path="/dashboard" element={<Dashboard getToken={this.props.getToken} />} />
                    <Route path="/dashboard/responses" element={<Responses getToken={this.props.getToken} />} />
                    <Route path="/dashboard/report" element={<Report api={this.props.api} isAdmin={this.props.isAdmin} />} />
                    {/* TODO: Add Profile (Link to Current User Page?) */}
                </>):(<></>)}
                <Route path="/login" element={<Login getToken={this.props.getToken} setToken={this.props.setToken} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
        );
    }
}