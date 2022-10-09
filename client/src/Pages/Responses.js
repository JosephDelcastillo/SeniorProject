import React from 'react'
import editIcon from '../Media/editicon.png';
import viewIcon from '../Media/viewicon.png';
import deleteIcon from '../Media/deleteicon.png';
/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */
function Responses() {
    return (
        /*This is just dummy data to imitate data from database. Will be using a for loop to get data from database and output table dynamically*/
        <>
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses - All Users </h1> 
            </div>
        </div>
            <div class="panel">
                <table class="table tableHover">
                    <thead>
                        <tr>
                            <th scope="col" width="180px"></th>
                            <th scope="col">Username</th>
                            <th scope="col" >Entry Date</th>
                            <th scope="col">Last Editted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton" onclick="viewReponse()"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="editResponse()"><img src={editIcon} alt='edit' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="deleteResponse()"><img src={deleteIcon} alt='delete' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>jdoe@janfl.com</td>
                            <td>9/18/22</td>
                            <td>jdoe@janfl.com</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton" onclick="viewReponse()"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="editResponse()"><img src={editIcon} alt='edit' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="deleteResponse()"><img src={deleteIcon} alt='delete' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>smae@janfl.com</td>
                            <td>9/20/22</td>
                            <td>smae@janfl.com</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton" onclick="viewReponse()"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="editResponse()"><img src={editIcon} alt='edit' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="deleteResponse()"><img src={deleteIcon} alt='delete' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>aexample@janfl.com</td>
                            <td>9/22/22</td>
                            <td>tguthrie@janfl.com</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                &nbsp;&nbsp;<button class="iconButton" onclick="viewReponse()"><img src={viewIcon} alt='view' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="editResponse()"><img src={editIcon} alt='edit' height='20px'/></button>&nbsp;&nbsp;
                                &nbsp;&nbsp;<button class="iconButton" onclick="deleteResponse()"><img src={deleteIcon} alt='delete' height='20px'/></button>&nbsp;&nbsp;
                            </th>
                            <td>tguy@janfl.com</td>
                            <td>9/24/22</td>
                            <td>tguy@janfl.com</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function deleteResponse(){
    /*Code to delete responses belongs here*/
}
function viewReponse(){
    /*Code to View individual responses belongs here*/
}
function editResponse(){
    /*Code to Edit individual responses belongs here*/
}

export default Responses