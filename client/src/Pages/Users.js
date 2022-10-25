import React from 'react';
import viewIcon from '../Media/viewicon.png';
 
//Grabs user data from server
async function getUsers() {
    return fetch('/api/getUsers').then(data => data.json());
}

//Inserts user data into template
//CURRENTLY A NONFUNCTIONING HOT MESS!!!!
function displayUsers(userInfo) {
    const tableUsers = document.getElementById("tableUsers");
    let newRow = document.createElement('tr');

    //Find out why the button isn't showing??????
    const viewButton = document.createElement('td');
    viewButton.innerHTML = "<button class=\"iconButton\"><img src=" + {viewIcon} + "alt='view' height='20px'/></button>";

    let userName = document.createElement('td');
    userName.innerText = userInfo.name;

    let userEmail = document.createElement('td');
    userEmail.innerText = userInfo.email;

    let userRole = document.createElement('td');
    userRole.innerText = userInfo.role;

    //Since we arent tracking archival stuff yet, this marks everyone as active
    let userArchive = document.createElement('td');
    userArchive.innerText = "N";

    newRow.append(viewButton, userName, userEmail, userRole, userArchive);
    tableUsers.append(newRow);
} 

//iterates through users in table and sends to display function
//FIND OUT WHY IT ITERATES TWICE?????
async function handleGetData() {
    let userInfoList = await getUsers();

    userInfoList.data.forEach(user => {
        displayUsers(user);
    });
}
 
/**
 * Create New User Page
 * @returns {React.Component}
 */
function Users() {
    handleGetData(); 

    return (
        <div className="card m-2 mt-5 border-none">
        <div className="card-header bg-white text-center">
        <h1>Users</h1>
        </div>
 
        <div class="panel">
                <table class="table tableHover">
                    <thead>
                        <tr>
                            <th scope="col" width="60px"></th>
                            <th scope="col">Name</th>
                            <th scope="col" >Email</th>
                            <th scope="col">Account Type</th>
                            <th scope="col">Archival Status</th>
                        </tr>
                    </thead>
                    <tbody id="tableUsers">
                    
                    </tbody>
                </table>
            </div>
 
        </div>
    )
}
 
export default Users
