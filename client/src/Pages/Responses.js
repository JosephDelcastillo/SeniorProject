import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import editIcon from '../Media/editicon.png';
import viewIcon from '../Media/viewicon.png';
import deleteIcon from '../Media/deleteicon.png';
/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */

//Handles clicking of edit button
function handleEditClick(e) {
    e.preventDefault();
    console.log('The edit button has been clicked')
}

//Handles clicking of view button
function handleViewClick(e) {
    e.preventDefault();
    console.log('The view button has been clicked')
}

//Handles clicking of Delete button

function handleDeleteClick(e) {
    e.preventDefault();
    console.log('The delete button has been clicked')
}

function filterData(data){
    let output=[];

        data.filter(e => e.question === 1).forEach(({email, entryDate, lastEdit, editDate, question, submission, value }) => {
            output.push({email: email, entryDate: entryDate, lastEdit: lastEdit, editDate: editDate, question: question, submission: submission, value: value });
        });
return output;    
}

function Responses() {
//Setup state tracking and pull data
    let passData = [];
    const [backendData, setBackendData] = useState([])
    const fetchData = async () => {
        const response = await fetch('/api/entries').then(data => data.json());
        
        if (response.success) {
            console.log(filterData(response.data));
            passData=(response.data);
            console.log(passData);
            setBackendData(filterData(response.data));
            return (filterData(response.data));
        } else {
            console.log("failed");
        }
    }
    useEffect(() => {
        fetchData()
            .then((res) => {
                setBackendData(res)
            })
            .catch((e) => {

            })
    }, [])
    // const navigate = useNavigate();
    // const redirToManage = () =>{
    //     navigate('../Pages/ManageResponse.js', {
    //         state: {
                
    //         }
    //     });
    // };


    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses - My Responses</h1>
            </div>
            <div className='card-body'>
                <hr />

                <div className="panel">
                    <table className="table tableHover">
                        <thead>
                            <tr>
                                <th scope="col" width="180px"></th>
                                <th scope="col">Email</th>
                                <th scope="col" >Entry Date</th>
                                <th scope="col">Last Editted</th>
                                <th scope="col">Edit Date</th>

                            </tr>
                        </thead>

                        {backendData.map((item, submission) => {
                            return (
                                <tbody key={submission}>
                                    <tr>
                                        <th scope="row">
                                            <button className="iconButton" onClick={() => {
         
        }}><img src={editIcon} alt='view' height='20px' /></button>
                                            {/* <button className="iconButton" onClick={handleEditClick}><img src={editIcon} alt='view' height='20px' /></button>
                                            <button className="iconButton" onClick={handleDeleteClick}><img src={deleteIcon} alt='view' height='20px' /></button> */}
                                        </th>

                                        <td>{item.email}</td>
                                        <td>{item.entryDate}</td>
                                        <td>{item.lastEdit}</td>
                                        <td>{item.editDate}</td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>

            </div>
        </div>
    )
}
export default Responses