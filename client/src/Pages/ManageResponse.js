import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'


//TO DO: FILTER INCOMING DATA BY ENTRYID POSTED FROM RESPONSES
//TO DO: SETUP A POST FUNCTION TO POST FORM CHANGES TO DATABASE
//TO DO: ADD CSS AND STYLING
//TO DO: SETUP ON FORM SUBMIT FUNCITONALITY TO UPDATE BACKEND

/**
 *  ManageResponse Page
 * 
 *  Manages Individual Response
 * @returns {React.Component} 
 */

//Setup state tracking and pull data
const BuildForm = () => {
    const [entryData, setEntryData] = useState([{}]);


    const fetchData = async () => {
        const response = await fetch('/api/entry').then(data => data.json());
        if (response.success) {
            console.log(response.data);
            setEntryData(response.data);
            return (response.data);
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

        <><table className="table">
            <thead>
                <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Entry Date</th>
                    <th scope="col">Last Editted</th>
                    <th scope="col">Edit Date</th>

                </tr>
            </thead>
            {console.log(entryData[0].email)}
            <tbody>
                <tr>
                    <td>{entryData[0].email}</td>
                    <td>{entryData[0].entryDate}</td>
                    <td>{entryData[0].lastEdit}</td>
                    <td>{entryData[0].editDate}</td>
                </tr>
            </tbody>
        </table>
            <form>
                {entryData.map((item, submission) => {

                    return (

                        <div className="form-group" key={submission}>
                            <><label htmlFor={item.question}>Question {item.question}:</label><input id='dynamicForm' className='form-control' type="text" defaultValue={item.value}></input></>
                        </div>
                    );
                })}
                <br></br>
                <br></br>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form></>
    )
}
//Display Page
function ManageResponse() {
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Responses - My Responses</h1>
            </div>
            <div className='card-body'>

                <div className="panel">

                    <hr />

                    {BuildForm()}
                </div>

            </div>
        </div>
    )
}
export default ManageResponse