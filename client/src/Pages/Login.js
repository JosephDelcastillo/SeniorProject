import React from 'react';
import Swal from 'sweetalert2';

// Constants 
const inputById = id => document.getElementById(id).value;

/**
 *  Login Page
 * 
 *  Manages Logging In 
 * @returns {React.Component} 
 */
export default function Login({ getToken, setToken, api}) {
  const handleSubmit = async e => {
    e.preventDefault();

    const data = {
      email: inputById('email'),
      password: inputById('password')
    }

    if(!data.email) Swal.fire({ title: 'Missing Email', text: 'Email Is required', icon: 'error' });
    if(!data.password) Swal.fire({ title: 'Missing Password', text: 'Password Is required', icon: 'error' });

    if(!data.email || !data.password) return false;
    const token = await api({ func: 'Login', data: { data } });
    if(!token.success) { 
      Swal.fire({title: "Login Failed", text: 'Check Your Email/Password', icon: 'error'});
      return false;
    }
    setToken(token.data);
    window.location.pathname = "dashboard";
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
            <input className="form-control" id='email' autoComplete="off" type="text" />
          </div>
          <div className="mb-3 col-4 mx-auto mt-5">
            <label className="form-label">Password</label>
            <input className="form-control" id='password' autoComplete="off" type="password" />
          </div>
          <div>
            <button className="btn btn-outline-primary col-3 mt-5" type="submit">Submit</button>
          </div>
        </form>
        <div className="text-center">
                <a href='/forgotpassword'> Forgot Password? </a>
            </div>
      </div>
    </div>
  )
}