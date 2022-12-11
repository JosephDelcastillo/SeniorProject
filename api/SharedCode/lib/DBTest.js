// Imports 
const { CosmosClient}  = require('@azure/cosmos');
require('dotenv').config();

// Reference Constants/Configuration 
const CONFIG = {
    key: process.env["COSMOS_KEY"],
    endpoint: process.env["COSMOS_ENDPOINT"]
}

/**
 *  Databases and the Constants to Access them 
 */
// IDs for the Databases 
const DATABASE_ID = "EPOTS";

// IDs for the containers
const CONTAINERS = {
    User: 'Users', 
    Session: 'Sessions', 
    Question: 'Questions', 
    Submit: 'Submissions', 
    Response: 'Responses' 
}


function GetContainer(containerId = '') {
    const client = new CosmosClient(CONFIG);
    
    console.log(Object.values(CONTAINERS))
    console.log(Object.values(CONTAINERS).includes(containerId))
    if(!Object.values(CONTAINERS).includes(containerId)) return false;
    // return client.database(DATABASE_ID).container(containerId);
    return containerId;
}

module.exports = {
    CONTAINERS,
    GetContainer
}