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
//Attempt Edit
function editRequest(data, sendFunc){
    Data_model.editRequest(data, sendFunc);
}

//Get all Entries
function getAllEntries (sendFunc) {
    Data_model.getAllEntries(sendFunc);
}
//Get Single Entry to Manage
function getEntry (sendFunc) {
    Data_model.getEntry(sendFunc);
}
module.exports = { 
    getAllSubmissions, attemptLogin, getAllEntries, editRequest, getEntry
};