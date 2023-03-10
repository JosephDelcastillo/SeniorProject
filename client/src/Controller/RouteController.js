import React from 'react';
import { Routes, Route} from "react-router-dom";

import Dashboard from '../Pages/Dashboard';
import Response from '../Pages/Response';
import Responses from '../Pages/Responses';
import NotFound from '../Pages/NotFound';
import Logout from '../Pages/Logout';
import Report from '../Pages/Report';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Form from '../Pages/Form';
import FormEdit from '../Pages/Form-Edit';
import NewUser from '../Pages/NewUser';
import Users from '../Pages/Users';
import UserPage from '../Pages/UserPage';
import EditUser from '../Pages/EditUser';
import Profile from '../Pages/Profile';
import EditProfile from '../Pages/EditProfile';

export default class RouteController extends React.Component {
    render() {
        return (
            <div className='container'> 
            <Routes>
                <Route path="/" element={<Home />} />
                {(this.props.getToken())?(<>
                    {(this.props.isAdmin())?(<>
                        <Route path="/dashboard/user" element={<Users getToken={this.props.getToken} api={this.props.api} />} />
                        <Route path="/dashboard/newuser" element={<NewUser getToken={this.props.getToken} api={this.props.api} />} />
                        <Route path="/dashboard/edituser/:email" element={<EditUser getToken={this.props.getToken} api={this.props.api} />} />
                        <Route path="/dashboard/form-edit" element={<FormEdit getToken={this.props.getToken} api={this.props.api}/>}/>
                        <Route path="/dashboard/user/:email" element={<UserPage getToken={this.props.getToken} api={this.props.api} />} />
                    </>):(<>
                        
                    </>)}
                    <Route path="/dashboard/form" element={<Form getToken={this.props.getToken} api={this.props.api} />} /> 
                    <Route path="/logout" element={<Logout resetToken={this.props.resetToken} api={this.props.api}/>} />
                    <Route path="/dashboard" element={<Dashboard getToken={this.props.getToken} />} />
                    <Route path="/dashboard/responses" element={<Responses getToken={this.props.getToken} api={this.props.api} />} />
                    <Route path="/dashboard/response/:id" element={<Response getToken={this.props.getToken} api={this.props.api} />} />
                    <Route path="/dashboard/report" element={<Report isAdmin={this.props.isAdmin} api={this.props.api} />} />
                    <Route path="/dashboard/profile" element={<Profile getToken={this.props.getToken} api={this.props.api} />} />
                    <Route path="/dashboard/profile/edit" element={<EditProfile getToken={this.props.getToken} api={this.props.api} />} />
                </>):(<></>)}
                <Route path="/login" element={<Login getToken={this.props.getToken} setToken={this.props.setToken} api={this.props.api} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
        );
    }
}