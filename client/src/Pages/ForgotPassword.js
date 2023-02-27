import React from 'react';
import Swal from 'sweetalert2';

// Constants 
const inputById = id => document.getElementById(id).value;

/**
 *  Forgot Password Page
 * 
 *  Manages Password Reset Email Sending 
 * @returns {React.Component} 
 */
export default function ForgotPass({ getToken, setToken, api}) {
  const handleSubmit = async e => {
    e.preventDefault();

    const data = {
      email: inputById('email')
    }

    if(!data.email) return false;
    //Change the function to forgot password function!!!!
    const {response} = await api({ func: 'ForgotPassword', data: {data} });
    if(!response.success) { 
      Swal.fire({title: "Reset Failed", text: 'Check Your Email', icon: 'error'});
      return false;
    } else {
      Swal.fire({title: "Reset Email Sent!", icon: 'success'}).then(function() {
        window.location = "/login";
      });
    } 
  }

  return(
    <div className="card m-2 mt-5 border-none">
      <div className="text-center">
        <h1>Forgot Password</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
      </div>
      <div className="card-body text-center">
        <p>Please enter the email address associated with your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 col-4 mx-auto mt-2">
            <label className="form-label">Email</label>
            <input className="form-control" id='email' autoComplete="off" placeholder='email@email.com' type="email" required />
          </div>
          <div>
            <button className="btn btn-outline-primary col-3 mt-5" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}