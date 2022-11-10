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
 //Get Questions
function getQuestions (sendFunc) {
    Data_model.getQuestions(sendFunc);
}
//Get Archive
function getArchive (sendFunc){
    Data_model.getArchive(sendFunc);
}

// Attempt Login
function attemptLogin (data, sendFunc) {
    Data_model.attemptLogin(data, sendFunc);
}

module.exports = {
    getAllSubmissions, attemptLogin, getQuestions, getArchive
};