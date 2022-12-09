import React from 'react';

//Grabs user data from server
async function getUsers() {
    return fetch('/api/getUsers').then(data => data.json());
}
 
//Gets user info and displays it
async function handleGetData() {
    const userEmail = sessionStorage.getItem("userEmail");

    let userInfoList = await getUsers();

    //Goes through user list until user is found, then displays data
    userInfoList.data.every(async user => {
        if (user.email === userEmail){
            
            const userInfo = document.getElementById("userInfo");

            let userHeader = document.createElement('div');
            userHeader.setAttribute("class", "card-header bg-white text-center");

            let userName = document.createElement('h1');
            userName.textContent = user.name;

            userHeader.appendChild(userName);

            let userEmail = document.createElement('h3');
            userEmail.setAttribute("class", "card-body bg-white text-center");
            userEmail.textContent = "User Email: " + user.email;

            let userAccount = document.createElement('h3');
            userAccount.setAttribute("class", "card-body bg-white text-center");
            userAccount.textContent = "Account Type: " + user.role;

            //Since we arent tracking archival stuff yet, this marks everyone as active
            let userArchive = document.createElement('h3');
            userArchive.setAttribute("class", "card-body bg-white text-center");
            userArchive.textContent = "Archive Statue: Active";

            userInfo.append(userHeader, userEmail, userAccount, userArchive);  

            return false;
        }

        return true;
    });
}

/**
 * User Page
 * @returns {React.Component}
 */
function UserPage() {

    handleGetData();

    //TODO:Connect the buttons to things
    return (
        <div className="card m-2 mt-5 border-none">

            <div id="userInfo"></div>

            <div className="text-center">
                    <a className='btn btn-outline-primary col-3 mt-5'> Edit </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Archive Account </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Reset Password </a>
            </div>

        </div>
    )
}
 
export default UserPage