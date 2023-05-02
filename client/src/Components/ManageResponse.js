import React, {useState, useEffect} from 'react'
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';


function ManageResponse({api, id, question, response, questionType}) {
    const params = useParams();
    const [entryData, setEntryData] = useState([{}]);
      useEffect(() => {                                                                 //Default state on page load
      api({ func: "GetSubmission", data: params.id }).then(({ success, data }) => {     //Call GetSubmission Function on Backend to get Submission Data
        if (success) {
          setEntryData(data);
        }
      });
    }, [api, params, setEntryData]);

      async function Edit(id, response, type){                                         //Edit Function to control changing of a response
            (questionType === "number" ? type = "number" : type = "text");             //Check for question input type
            if(questionType === "number"){
              response = parseInt(response);
            }
            Swal.fire({                                                               //Modal window with input text field
                title: 'Edit Response',
                confirmButtonText:"Save Changes",                     
                showCloseButton: true,
                html:`        
                    <input id="editId" type = "hidden" value="${id}"></input>
                    <label>Response (${type === "number" ? "Number" : "Text"})
                        <br/>
                        <input id="editResponse" type= ${type} value="${response}"></input>
                        
                    </label>
                <br/>
                `
            }).then((result) =>{
                if(result.isConfirmed){
                    SaveContentEdit(document.getElementById("editId").value,document.getElementById("editResponse").value);   //When Save Button is clicked, run call SaveContentEdit function
                } else {
                    Swal.fire('Changes are not saved') 
                }
            })
      }

    async function SaveContentEdit(id, response){                                                       //Function that passes the updated data to the backend.

        const {success, message, data } = await api({ func: 'EditResponse', data: {id, response}});    //Called backend function EditResponse and passes it new information
       
        
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });                      //Fail Condition
            return false;
        } 
                const index = entryData.responses.findIndex(responseData => responseData.id === data.id);
        if(index < 0) {                                                                              //If the user somehow manages to change a response that does not exist
            Swal.fire({ title: 'Submit Failed', text: "Response Id Not Found", icon: 'error' });  
            return false;
      }

        setEntryData(entryData);                                                                    //Update state to show the updated data

        Swal.fire({title: 'Response Updated', text: 'Response Updated!', icon: 'success'}).then(()=>{window.location.reload()})
        return false;
    }

  return (
    <div className='row'>
        <div className='col-11'>
          <div className='row'>
            <div className='col-12'>
             <h5>{question} </h5>
            </div>
            <div className='col-12'>
              <h6>{response} </h6>
            </div>
          </div>
        </div>
        <div className='col-1'>
            <i className='fa fa-pencil text-info c-pointer' onClick={() => Edit(id, response)}></i> 
        </div>
    </div>
  )
  }
export default ManageResponse