import React from 'react'
import { useParams} from "react-router-dom";
//import { Submissions } from '../../../api/SharedCode/lib/DBDevelopment';
function Response({api}) {
    const params = useParams();
    //get from api
    //current submission data
    //questions
    //responses
    //regsiter out each of these
    //validate that i have parameter that is id, otherwise redirect to 404 page or error page
    //if I have an ID parameter, check for backend data
    //if I do have backend data, generate it out.
    //include an edit button somewhere
  return (
    <div>Response</div>

  )
}

export default Response