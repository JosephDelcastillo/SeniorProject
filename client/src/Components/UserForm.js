import React from "react";

function UserForm({handleSubmit, user}) {


    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplName" className="form-label">Employee Name:</label>
                <input type="text" id="emplName" name="emplName" placeholder="John Doe" className="form-control"></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="emplEmail" className="form-label">Employee Email:</label>
                <input type="email" id="emplEmail" name="emplEmail" placeholder="123@email.com" className="form-control"></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label htmlFor="accType" className="form-label">Account Type:</label>
                <select name="accType" id="accType" className="form-control">
                    <option value="0">Select Account Type</option>
                    <option value="staff">Staff User</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
 
            <button className="btn btn-outline-primary col-3 mt-5" type="submit"> Save </button>
            <a href='/dashboard/user' type='button' className="btn btn-outline-primary col-3 mt-5"> Cancel </a>
        </form>
    )
}

export default UserForm;