import React, {useState, useEffect} from 'react'
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';


function ManageResponse({api, id, question, response}) {
    const params = useParams();
    const [entryData, setEntryData] = useState([{}]);
    console.log("Entry Data: ", entryData);
    useEffect(() => {
      api({ func: "GetSubmission", data: params.id }).then(({ success, data }) => {
        if (success) {
          setEntryData(data);
        }
      });
    }, [api, params, setEntryData]);

      async function Edit(id, response){
            Swal.fire({
                title: 'Edit Response',
                confirmButtonText:"Save Changes",
                showCloseButton: true,
                html:`        
                    <input id="editId" type = "hidden" value="${id}"></input>
                    <label>Response
                        <br/>
                        <input id="editResponse" value="${response}"></input>
                    </label>
                <br/>
                `
            }).then((result) =>{
                if(result.isConfirmed){
                    SaveContentEdit(document.getElementById("editId").value,document.getElementById("editResponse").value);
                } else {
                    Swal.fire('Changes are not saved') 
                }
            })
      }

    async function SaveContentEdit(id, response){
        const {success, message, data } = await api({ func: 'EditResponse', data: {id, response}});
        console.log(data);
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        } 
                const index = entryData.responses.findIndex(responseData => responseData.id === data.id);
        if(index < 0) {
            Swal.fire({ title: 'Submit Failed', text: "Response Id Not Found", icon: 'error' });
            return false;
      }

        setEntryData(entryData);

        Swal.fire({title: 'Question Content Updated', text: 'Question Content Updated!', icon: 'success' });
        window.location.reload();
        return false;
    }

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
            <i className='fa fa-pencil text-info c-pointer' onClick={() => Edit(id, response)}></i>
        </div>
    </div>
  )
  }
export default ManageResponse