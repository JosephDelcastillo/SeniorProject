"use strict";

// Imports
const bodyParser = require('body-parser');
const express = require("express");
const data = require('./controllers/Data')

// Initializations 
const PORT = 5000;
const app = express();
const Data_Controller = data;

// Configure App 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Api Navigation
 */
// Root Level - Public Access Functions 
// Menu
app.get("/api", (req, res) => { Data_Controller.getAllSubmissions((data) => res.json(data)); })

//All Entries
app.get("/api/entries", (req, res) => {Data_Controller.getAllEntries((data)=> res.json(data)); })


//Individual Entry for Edit
app.get("/api/entry", (req, res) => {Data_Controller.getEntry((data)=> res.json(data)); })

//Entry change request
app.post("/api/edit", (req, res) => { Data_Controller.editRequest(req.body, (data) => res.json(data)); })

// Login 
app.post("/api/user", (req, res) => { Data_Controller.attemptLogin(req.body, (data) => res.json(data)); })

/**
 * Finally Start the App 
 */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})