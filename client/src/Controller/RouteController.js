import React from 'react';
import { Routes, Route } from "react-router-dom";

import Dashboard from '../Pages/Dashboard';
import Responses from '../Pages/Responses';
import NotFoud from '../Pages/NotFound';
import Logout from '../Pages/Logout';
import Report from '../Pages/Report';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Form from '../Pages/Form';

export default class RouteController extends React.Component {
    render() {
        return (
            <div className='container'> 
            <Routes>
                <Route path="/" element={<Home />} />
                {(this.props.getToken())?(<>
                    <Route path="/logout" element={<Logout resetToken={this.props.resetToken} />} />
                    <Route path="/dashboard" element={<Dashboard getToken={this.props.getToken} />} />
                    <Route path="/dashboard/form" element={<Form getToken={this.props.getToken} />} />
                    <Route path="/dashboard/responses" element={<Responses getToken={this.props.getToken} />} />
                    <Route path="/dashboard/report" element={<Report getToken={this.props.getToken} />} />
                </>):(<></>)}
                <Route path="/login" element={<Login getToken={this.props.getToken} setToken={this.props.setToken} />} />
                <Route path="*" element={<NotFoud />} />
            </Routes>
            </div>
        );
    }
}