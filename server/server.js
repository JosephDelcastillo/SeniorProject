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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Api Navigation
 */
// Root Level - Public Access Functions 
// Data
app.get("/api", (req, res) => { Data_Controller.getAllSubmissions((data) => res.json(data)); }) 
 
// Login
app.post("/api/user", (req, res) => { Data_Controller.attemptLogin(req.body, (data) => res.json(data)); })
  
// Add New User
app.post("/api/newUser", (req, res) => { Data_Controller.addUser(req.body, (data) => res.json(data)); }); 

// Get User Data
app.get("/api/getUsers", (req, res) => { Data_Controller.getUsers((data) => res.json(data)); })

// Staff Level - Private Access Functions 
app.post("/api/report", (req, res) => {  Data_Controller.getReport(req.body, (data) => res.json(data)); })
app.post("/api/question", (req, res) => {  Data_Controller.getQuestion(req.body, (data) => res.json(data)); })

// Admin Level - Private Access Functions 
app.post("/api/staff", (req, res) => {  Data_Controller.getStaff(req.body, (data) => res.json(data)); })

/**
 * Finally Start the App
 */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})