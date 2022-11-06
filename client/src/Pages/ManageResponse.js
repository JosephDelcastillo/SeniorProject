import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

//Pull Response Data for the Form to Fill Out
function ManageResponse() {
    
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
    
                        </table>
                    </div>
    
                </div>
            </div>
        )
    }
    export default ManageResponse