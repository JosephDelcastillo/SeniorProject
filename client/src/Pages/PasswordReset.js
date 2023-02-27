import React from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

// Constants 
const inputById = id => document.getElementById(id).value;

/**
 *  Reset Password Page
 * 
 *  Manages Resetting Password 
 * @returns {React.Component} 
 */
export default function PasswordReset({ getToken, setToken, api}) {
  let { pass, email } = useParams();

  const handleSubmit = async e => {
    e.preventDefault();

    const data = {
      email: email,
      oldpass: pass,
      password: inputById('pass'),
      password2: inputById('pass2')
    }

    if(!data.password || !data.password2) return false;
    const token = await api({ func: 'ResetPassword', data: { data } });
    if(!token.success) { 
      Swal.fire({title: "Reset Failed", icon: 'error'});
      return false;
    } else {
      Swal.fire({title: "Reset Successful!", icon: 'success'}).then(function() {
        window.location = "/login";
      });
    }
  }

  return(
    <div className="card m-2 mt-5 border-none">
      <div className="text-center">
        <h1>Password Reset</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
      </div>
      <div className="card-body text-center">
        <p>Please enter your new password.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 col-4 mx-auto mt-2">
            <label className="form-label">New Password</label>
            <input className="form-control" id='pass' autoComplete="off" type="password" required />
          </div>
          <div className="mb-3 col-4 mx-auto mt-2">
            <label className="form-label">Confirm New Password</label>
            <input className="form-control" id='pass2' autoComplete="off" type="password" required/>
          </div>
          <div>
            <button className="btn btn-outline-primary col-3 mt-5" type="submit">Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}