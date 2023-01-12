import React from 'react';

//constants
const API_URL = (true) ? "https://epots-api.azurewebsites.net/api" : '/api';

//Displays user info
async function displayUser(user) {
            
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
        userAccount.textContent = "Account Type: " + "Staff";

        let userArchive = document.createElement('h3');
        userArchive.setAttribute("class", "card-body bg-white text-center");
        userArchive.textContent = "Archive Status: " + user.archived;

        userInfo.append(userHeader, userEmail, userAccount, userArchive);  

        return true;
}

/**
 * User Page
 * @returns {React.Component}
 */
function UserPage({ getToken, api }) {

    getUser();

    //Grabs user data from database
    async function getUser() {
        const { success, data } = await api({ func: 'GetStaff', data: {"search": sessionStorage.getItem("userEmail")}});
        if (success) {
            data.forEach(async user => {
                await displayUser(user);
            })
        }
    }

    //TODO:Connect the buttons to things
    return (
        <div className="card m-2 mt-5 border-none">

            <div id="userInfo"></div>

            <div className="text-center">
                    <a className='btn btn-outline-primary col-3 mt-5' href='/dashboard/edituser'> Edit </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Archive Account </a>
                    <a className='btn btn-outline-primary col-3 mt-5'> Reset Password </a>
            </div>

        </div>
    )
}
 
export default UserPage