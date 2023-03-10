import React from 'react';
import axios from 'axios';
import NavBar from './Components/NavBar';
import RouteController from "./Controller/RouteController";

const LOCAL_STORAGE_KEY = 'janfl-epots.user';
const API = false ? "http://localhost:7071" : "https://epots-api.azurewebsites.net";

function setToken(userToken) { sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userToken)); }
function getToken() { return sessionStorage.getItem(LOCAL_STORAGE_KEY); }
function resetToken () { sessionStorage.removeItem(LOCAL_STORAGE_KEY); }

function isAdmin () {
  const token = getToken();
  if(!token || !JSON.parse(token)) return false;
  const obj = JSON.parse(token)
  return typeof obj.attr === "string" && obj.attr.toLowerCase() === "admin"
}

/**
  * API Helper Function <br>
  * 
  *  Runs axios call based on parameters and handles the errors
  * @param {string} func    The URL part of the api function name (api/{func})
  * @param {object} data    The data to pass, TOKEN is auto-amendend if it exists
  * @param {string} action  POST or GET | Defaults to POST
 */
async function api({ func, data, action }) {
  //********  Step 1: Initialize Data  ********
  // Prepare URL
  const API_URL = `${API}/api`
  // Get Post vs Get
  const IS_POST = action ? (action.toLowerCase() !== 'get') : true; // Default to POST 

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

function App() { 
  return ( 
    <div>
      <NavBar getToken={getToken} isAdmin={isAdmin} />
      <div className='container'>
        <RouteController getToken={getToken} setToken={setToken} resetToken={resetToken} api={api} isAdmin={isAdmin} />
      </div> 
    </div> 
  ) 
} 

export default App