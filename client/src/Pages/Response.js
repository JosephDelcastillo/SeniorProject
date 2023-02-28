import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManageResponse from "../Components/ManageResponse";
import Swal from 'sweetalert2';
const subDate = str => {
  if(!str || str.length < 10) return '';
  return str.substr(0, 10);
}

function Response({ api }) {
	const params = useParams();
	const [responseData, setResponseData] = useState([{}]);
	console.log("Response Data:", responseData);
	useEffect(() => {
		api({ func: "GetSubmission", data: params.id }).then(({ success, data }) => {
			if (success) {
				setResponseData(data);
			}
		});
	}, [api, params, setResponseData]);
	console.log(params.id);

	async function Edit(id, response){
        Swal.fire({
            title: 'Edit Response',
            confirmButtonText:"Save Changes",
            showCloseButton: true,
            html:`        
                <input id="editId" type="hidden" value="${id}"></input>
                <label>Question Text
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
        const {success, message, data } = await api({ func: 'Edit', data: {id, response}});
        if(!success) {
            Swal.fire({ title: 'Submit Failed', text: message, icon: 'error' });
            return false;
        }

        
        const index = responseData.findIndex(responseData => responseData.id === data.id);
        if(index < 0) {
            Swal.fire({ title: 'Submit Failed', text: "Response Id Not Found", icon: 'error' });
            return false;
        }


        let copyResponseData = [ ...responseData ];
        copyResponseData[index] = data;
        setResponseData(copyResponseData);

        Swal.fire({title: 'Response Updated', text: 'Response Updated!', icon: 'success' });

            document.getElementById("responseId").value = "";
            document.getElementById("response").value = "";

        return(true);
    }

	return (
		<div className="card m-2 border-none">
			<div className="card-header bg-white text-center">
				<h1> Response </h1>
			</div>
			<div className="card-body">
				{params && params.id ? (
					<div className="panel">
						<div className="row">
							{responseData && responseData.submissions && responseData.users ? (
								<>
									<div className="col-2">
										<h4>Created:</h4>
									</div>
									<div className="col-4">
										<h4>{subDate(responseData.submissions[0].created)}</h4>
									</div>
									<div className="col-1">
										<h4>By:</h4>
									</div>
									<div className="col-5">
										<h4>{responseData.users.find((u) => u.id === responseData.submissions[0].user).name}</h4>
									</div>
									<br />
									<br />
									<br />
								</>
							) : (
								<></>
							)}
						</div>
						{responseData && responseData.questions && responseData.responses ? (
							<>
								{responseData.responses.map((response) => (
									<ManageResponse key={response.id} id={response.id} response={response.response} question={response.questions.find((q) => q.id === response.question).text} />
								))}
							</>
						) : (
							<></>
						)}
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
export default Response;
