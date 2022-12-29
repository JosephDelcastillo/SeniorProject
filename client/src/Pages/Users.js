import React from 'react';
import viewIcon from '../Media/viewicon.png';
 

//Saves user email to session storage and redirects to user page of specified user
function viewUser(userEmail) {
    //Maybe not that secure? :(
    sessionStorage.setItem("userEmail", userEmail);

    window.location = "/dashboard/user";
}

//Creates a row, inserts user info into row, inserts row into table
async function displayUsers(userInfo) {
    const tableUsers = document.getElementById("tableUsers");
    let newRow = document.createElement('tr');

    let viewButtonBox = document.createElement('td');
    let viewButton = document.createElement('button');
    viewButton.className = "iconButton";
    viewButton.addEventListener("click", function(){
        viewUser(userInfo.email);
    });

    let buttonImg = document.createElement('img');
    buttonImg.setAttribute("src", viewIcon);
    buttonImg.setAttribute("alt", "view");
    buttonImg.setAttribute("height", '20px');

    viewButton.appendChild(buttonImg);
    viewButtonBox.appendChild(viewButton); 

    let userName = document.createElement('td');
    userName.textContent = userInfo.name;

    let userEmail = document.createElement('td');
    userEmail.textContent = userInfo.email;

    //API does not currently return!!!!!
    //TODO: add role to API
    let userRole = document.createElement('td');
    userRole.textContent = "NA";

    let userArchive = document.createElement('td');
    userArchive.textContent = userInfo.archived;

    newRow.append(viewButtonBox, userName, userEmail, userRole, userArchive);
    tableUsers.append(newRow);
} 

 
/**
 * Users Page
 * @returns {React.Component}
 */
function Users({ getToken, api }) {
    //Triggers getUsers function to get user info from server
    getUsers();

    //Grabs user data from database
    async function getUsers() {
        const { success, data } = await api({ func: 'GetStaff', data: {"search": ""}});
        if (success) {
            data.forEach(async user => {
                await displayUsers(user);
            })
        }
    }


    return (
        <div className="card m-2 mt-5 border-none">
        <div className="card-header bg-white text-center">
        <h1>Users</h1>
        </div>
 
        <div className="panel">
                <table className="table tableHover">
                    <thead>
                        <tr>
                            <th scope="col" width="60px"></th>
                            <th scope="col">Name <button>&#9660;</button></th>
                            <th scope="col">Email <button>&#9660;</button></th>
                            <th scope="col">Account Type <button>&#9660;</button></th>
                            <th scope="col">Archival Status <button>&#9660;</button></th>
                        </tr>
                    </thead>
                    <tbody id="tableUsers">
                    </tbody>
                </table>
            </div>

            <div className="text-center">
                <a href='/dashboard/newuser' className='btn btn-outline-primary col-3 mt-5'> Create New User </a>
            </div>

        </div>

    )
}
 
export default Users
