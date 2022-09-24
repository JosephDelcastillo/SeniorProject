import React from 'react';
import NavBar from './Components/NavBar';
import RouteController from "./Controller/RouteController";

const LOCAL_STORAGE_KEY = 'janfl-epots.user';

function setToken(userToken) { sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userToken)); }
function getToken() { return sessionStorage.getItem(LOCAL_STORAGE_KEY); }
function resetToken () { sessionStorage.removeItem(LOCAL_STORAGE_KEY); }

function App() { 
  return ( 
    <div>
      <NavBar getToken={getToken} />
      <div className='container'>
        <RouteController getToken={getToken} setToken={setToken} resetToken={resetToken}  />
      </div> 
    </div> 
  ) 
} 

export default App