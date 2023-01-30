import axios from "axios";

/**
  * API Helper Function <br>
  * 
  *  Runs axios call based on parameters and handles the errors
  * @param {string} func    The URL part of the api function name (api/{func})
  * @param {object} data    The data to pass, TOKEN is auto-amendend if it exists
  * @param {string} action  POST or GET | Defaults to POST
 */
async function call(getToken, { func, data, action }) {
    //********  Step 1: Initialize Data  ********
    // Prepare URL
    const API_URL = `/api`
    // Get Post vs Get
    const IS_POST = action ? (action.toLowerCase() !== 'get') : true ; // Default to POST 

    // Setup Url
    let url = `/${func}`;
    if(!IS_POST){
        url += "?";
        // Cycle through all key value pairs of data and converting them into a GET query
        for(const [key, value] of Object.entries(data)){
            url += `${key}=${value}&`;
        }
        // Remove Last '&'
        url = url.slice(0, -1);
    }
    // Setup Data (With Token Possible)
    const DATA = getToken() ? { token: JSON.parse(getToken()), data } : data;

    if(IS_POST){
        return await axios.post(API_URL + url, DATA).then(response => response.data)
    } else {
        return await axios.get(API_URL + url).then(response => response.data)
    }
}

export {
    call
}