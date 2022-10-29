import React from 'react';
import viewIcon from '../Media/viewicon.png';
 
//Grabs user data from server
async function getUsers() {
    return fetch('/api/getUsers').then(data => data.json());
}

//Creates a row, inserts user info into row, inserts row into table
async function displayUsers(userInfo) {
    const tableUsers = document.getElementById("tableUsers");
    let newRow = document.createElement('tr');

    let viewButtonBox = document.createElement('td');
    let viewButton = document.createElement('button');
    viewButton.className = "iconButton";

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

    let userRole = document.createElement('td');
    userRole.textContent = userInfo.role;

    //Since we arent tracking archival stuff yet, this marks everyone as active
    let userArchive = document.createElement('td');
    userArchive.textContent = "N";

    newRow.append(viewButtonBox, userName, userEmail, userRole, userArchive);
    tableUsers.append(newRow);
} 

//Iterates through users in table and sends to display function
async function handleGetData() {
    let userInfoList = await getUsers();

    userInfoList.data.forEach(async user => {
        await displayUsers(user);
    });
}
 
/**
 * Users Page
 * @returns {React.Component}
 */
function Users() {
    //Triggers handleGetData function to get user info from server
    handleGetData();

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
