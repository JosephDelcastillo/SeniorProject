// Imports 
const CosmosClient = require('@azure/cosmos').CosmosClient;
require('dotenv').config();

// Reference Constants/Configuration 
const key = process.env["COSMOS_KEY"];
const endpoint = process.env["COSMOS_ENDPOINT"];

/**
 *  Databases and the Constants to Access them 
 */
// IDs for the Databases 
const DATABASE_ID = "EPOTS";

// IDs for the containers
const containerIds = {
    User: 'Users', 
    Session: 'Sessions', 
    Question: 'Questions', 
    Submit: 'Submissions', 
    Response: 'Responses' 
}

// Creating References 
// Creating Client to run everything 
const client = new CosmosClient({ endpoint, key });

// Create Database References 
const DATABASE = client.database(DATABASE_ID);

// Expoort Container References 
module.exports = {
    Users: DATABASE.container(containerIds.User), 
    Sessions: DATABASE.container(containerIds.Session), 
    Questions: DATABASE.container(containerIds.Question), 
    Submits: DATABASE.container(containerIds.Submit), 
    Responses: DATABASE.container(containerIds.Response) 
}
