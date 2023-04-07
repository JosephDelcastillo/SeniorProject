import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManageResponse from "../Components/ManageResponse";

const subDate = str => {
	if(!str || str.length < 10) return '';
	return str.substr(0, 10);
}

function Response({ api }) {
	const params = useParams();
	const [entryData, setEntryData] = useState([{}]);
	useEffect(() => {
		api({ func: "GetSubmission", data: params.id }).then(({ success, data }) => {
			if (success) {
				setEntryData(data);
			}
		});
	}, [api, params, setEntryData]);

	return (
		<div className="card m-2 border-none">
			<div className="card-header bg-white text-center">
				<h1> Response </h1>
			</div>
			<div className="card-body">
				{params && params.id ? (
					<div className="panel">
						<div className="row">
							{entryData && entryData.submissions && entryData.users ? (
								<>
									<div className="col-2">
										<h4>Created:</h4>
									</div>
									<div className="col-4">
										<h4>{subDate(entryData.submissions[0].created)}</h4>
									</div>
									<div className="col-1">
										<h4>By:</h4>
									</div>
									<div className="col-5">
										<h4>{entryData.users.find((u) => u.id === entryData.submissions[0].user).name}</h4>
									</div>
									<br />
									<br />
									<br />
								</>
							) : (
								<></>
							)}
						</div>
						{entryData && entryData.questions && entryData.responses ? (
							<>
								{entryData.responses.map((response) => (
									<ManageResponse key={response.id} api = {api} id={response.id} response={response.response} question={entryData.questions.find((q) => q.id === response.question).text} questionType={entryData.questions.find((q) => q.id === response.question).type}/>
									
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

