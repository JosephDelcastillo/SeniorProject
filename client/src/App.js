import React from 'react';
import NavBar from './Components/NavBar';
import RouteController from "./Controller/RouteController";

import { call } from './Controller/API';

const LOCAL_STORAGE_KEY = 'janfl-epots.user';

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
  return await call(getToken, { func, data, action });
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