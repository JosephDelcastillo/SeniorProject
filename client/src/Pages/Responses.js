import React, { useState, useEffect } from 'react'
import editIcon from '../Media/editicon.png'
import deleteIcon from '../Media/deleteicon.png'
import axios from 'axios'

const API_URL =  '/api/edit';
function filterData(data){
    let output=[];
        data.filter(e => e.question === 1).forEach(({entryId, email, entryDate, lastEdit, editDate, question, submission, value }) => {
            output.push({entryId: entryId, email: email, entryDate: entryDate, lastEdit: lastEdit, editDate: editDate, question: question, submission: submission, value: value });
        });
return output;    
}
//TO DO: ADD ACTUAL FUNCTIONALITY TO DELETE/ARCHIVE FEATURE
function handleDeleteClick()
{
    console.log('The delete button has pressed');
}

const BuildTable = () =>{
    //Setup state tracking and pull data
    const [entryData, setEntryData] = useState([{}]);


    const fetchData = async () => {
    const response = await fetch('/api/entries').then(data => data.json());
        
        if (response.success) {

            setEntryData(filterData(response.data));
            return (filterData(response.data));
        } else {
            console.log("failed");
        }
    }
    useEffect(() => {
        fetchData()
            .then((res) => {
                setEntryData(res)
            })
            .catch((e) => {

            })
    }, []);



    return (
    <div className="panel">
    <table className="table tableHover">
        <thead>
            <tr>
                <th scope="col" width="100px"></th>
                <th scope="col">Email</th>
                <th scope="col" >Entry Date</th>
                <th scope="col">Last Editted</th>
                <th scope="col">Edit Date</th>

            </tr>
        </thead>
        
        {entryData.map((item, submission) => {
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    const entryId = {
                    entryId: item.entryId
                    };
                    console.log(entryId);
                    axios.post(API_URL, entryId).then((response)=> {
                        console.log(response.status)
                        window.open('/dashboard/manage_response')
                    });
                  };
            return (
                <tbody key={submission}>
                    <tr>
                        <th scope="row">
                            <button className="iconButton" onClick={(handleSubmit)} alt='Edit'><img src={editIcon} alt='view' height='20px' /></button>
                            <button className="iconButton" onClick={handleDeleteClick} alt='Delete'><img src={deleteIcon} alt='delete' height='20px' /></button>
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
)}

/**
 *  Responses Page
 * 
 *  Manages Responses 
 * @returns {React.Component} 
 */


function Responses() {
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses - My Responses</h1>
            </div>
            <div className='card-body'>
                <hr />
                {BuildTable()}
            </div>
        </div>
    )
}
export default Responses