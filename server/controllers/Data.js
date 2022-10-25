/**
 * Data Controller
 *
 * Manages Database Data
 */
 const { Reply } = require('../helpers/Helpers');
 const Data_model = require('../models/Data');
  
 /* Public Functions  */
 // Get Menu
 function getAllSubmissions (sendFunc) {
     Data_model.getAllSubmissions(sendFunc);
 }
  
 // Attempt Login
 function attemptLogin (data, sendFunc) {
     Data_model.attemptLogin(data, sendFunc);
 }

 // Add User
function addUser (data, sendFunc) {
    Data_model.addUser(data, sendFunc);
}

//Get Users
function getUsers (data, sendFunc) {
    Data_model.addUser(data, sendFunc);
}
  
 module.exports = {
     getAllSubmissions, attemptLogin, addUser, getUsers
 };
 