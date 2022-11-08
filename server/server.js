"use strict";

// Imports
const createHandler = require("azure-function-express").createHandler;
const bodyParser = require('body-parser');
// const path = require('path');
const express = require("express");
const data = require('./controllers/Data')

// Initializations 
const PORT = process.env.PORT || 5000;
const app = express();
const Data_Controller = data;

// Configure App 
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: true }));

/** 
 *  App Navigation
 */
// app.get('/*', ( req, res ) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

/**
 * Api Navigation
 */
// Root Level - Public Access Functions 
// Data
app.get("/api", (req, res) => { Data_Controller.getAllSubmissions((data) => res.json(data)); })

// Login 
app.post("/api/user", (req, res) => { Data_Controller.attemptLogin(req.body, (data) => res.json(data)); })

// Get ALl Entries
app.get("/api/entries", (req, res) => { Data_Controller.getAllEntries((data) => res.json(data)); })

// Edit Response Post Request 
app.post("/api/edit", (req, res) => { Data_Controller.editRequest(req.body, (data) => res.json(data)); })

/**
 * Finally Start the App 
 */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

module.exports = createHandler(app);