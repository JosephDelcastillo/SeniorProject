import React from 'react'

/**
 * Create New User Page 
 * @returns {React.Component} 
 */
function NewUser() {
    return (
        <div className="card m-2 mt-5 border-none">
        <div className="text-center">
        <h1>Create New User Account</h1>
        <hr style={{ width: '15rem', margin: "auto" }}/>
        </div>

        <div className="card-body text-center">
        <form>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="emplName" className="form-label">Employee Name:</label>
                <input type="text" id="emplName" name="emplName" placeholder="John Doe" className="form-control" required></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="emplRole" className="form-label">Employee Role:</label>
                <input type="text" id="emplRole" name="emplRole" placeholder="Volunteer" className="form-control" required></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="emplEmail" className="form-label">Employee Email:</label>
                <input type="email" id="emplEmail" name="emplEmail" placeholder="123@email.com" className="form-control" required></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="accType" className="form-label">Account Type:</label>
                <select name="accType" className="form-control">
                    <option value="0" required>Select Account Type</option>
                    <option value="staff">Staff User</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="username" className="form-label">Account Username:</label>
                <input type="text" id="username" name="username" placeholder="123@email.com" className="form-control" required></input>
            </div>
            <div className="mb-3 col-4 mx-auto mt-1">
                <label for="emplPass" className="form-label">Account Password:</label>
                <input type="text" id="emplPass" name="emplPass" placeholder="DoeJohn" className="form-control" required></input>
            </div>

            <button className="btn btn-outline-primary col-3 mt-5" type="submit">Create</button>
            <button className="btn btn-outline-primary col-3 mt-5" type="reset">Clear</button>
        </form>
        </div>

        </div>
    )
}

export default NewUser