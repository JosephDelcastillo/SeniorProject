import React from 'react';
import viewIcon from '../Media/viewicon.png';
 
//Grabs user data from server
async function getUsers() {
    return fetch('/api/getUsers').then(data => data.json());
}

//Inserts user data into template
//CURRENTLY A NONFUNCTIONING HOT MESS!!!!
/* function displayUsers(userInfo) {

    const tableUsers = document.querySelector(".tableUsers");
    let newRow = document.createElement('tr');

    let viewButton = document.createElement('th')
    viewButton.innerHTML = "&nbsp;&nbsp;<button class=\"iconButton\"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;";

    let userName = document.createElement('td');
    userName.innerText = userInfo.name;

    let userEmail = document.createElement('td');
    userName.innerText = userInfo.email;

    let userRole = document.createElement('td');
    userName.innerText = userInfo.role;

    //Since we arent tracking archival stuff yet, this marks everyone as active
    let userArchive = document.createElement('td');
    userName.innerText = "N";

    newRow.append(viewButton, userName, userEmail, userRole, userArchive);
    tableUsers.append()
}  */
 
/**
 * Create New User Page
 * @returns {React.Component}
 */
function Users() {

    //iterates through users in table and sends to display function
    //ALSO CURRENTLY NONFUNCTIONING HOT MESS!!!
    /* let userInfoList = await getUsers();
    userInfoList.forEach(user => {
        displayUsers(user);
    }); */

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
                    <tbody id="tableUsersRow">
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>John Doe</td>
                            <td>123@email.com</td>
                            <td>Staff</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>Jane Doe</td>
                            <td>1234@email.com</td>
                            <td>Staff</td>
                            <td>N</td>
                        </tr>
                    </tbody>
                </table>
            </div>
 
        </div>
    )
}
 
export default Users
