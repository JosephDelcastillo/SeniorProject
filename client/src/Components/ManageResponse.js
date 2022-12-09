import React from 'react'

function ManageResponse({id, question, response}) {
  return (
    <div className='row'>
        <div className='col-11'>
          <div className='row'>
            <div className='col-12'>
             <h5> Question: {question} </h5>
            </div>
            <div className='col-12'>
              <h6> Answer: {response} </h6>
            </div>
          </div>
        </div>
        <div className='col-1'>
            <i className='fa fa-pencil text-info c-pointer'></i>
        </div>
    </div>
  )
}

export default ManageResponse