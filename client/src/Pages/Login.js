//import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Constants 
const API_URL = (true) ? "https://epots-api.azurewebsites.net/api" : '/api';

/**
 *  Login Page
 * 
 *  Manages Logging In 
 * @returns {React.Component} 
 */
export default function Login({ getToken, setToken, api}) {
  let username = "";
  let password = "";

  async function loginUser({username, password}) {
    const { success, data } = await api({ func: 'Login', data: {"email": username, "password": password}});
    //return { success: true, data: 'tempToken' }
    // return fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
    // .then(data => data.json())
    
    return {success, data};
  }
  
  if(getToken && getToken()) {
    return (
      <Navigate to="/dashboard" />
    )
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({ username, password });
    console.log(token);
    if(token.success) { 
      //setToken(token.data);
      window.location.pathname = "dashboard";
    } else {
      Swal.fire({title: "Login Failed", icon: 'error'})
    }
  }

  return(
    <div className="card m-2 mt-5 border-none">
      <div className="text-center">
        <h1>Log In</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
      </div>
      <div className="card-body text-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 col-4 mx-auto mt-2">
            <label className="form-label">Email</label>
            <input className="form-control" autoComplete="off" type="text" onChange={e => username = e.target.value} />
          </div>
          <div className="mb-3 col-4 mx-auto mt-5">
            <label className="form-label">Password</label>
            <input className="form-control" autoComplete="off" type="password" onChange={e => password = e.target.value} />
          </div>
          <div>
            <button className="btn btn-outline-primary col-3 mt-5" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

 Login.propTypes = {
  setToken: PropTypes.func.isRequired
}; 