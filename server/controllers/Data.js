/**
 * Data Controller
 * 
 * Manages Database Data
 */
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

/* Private Functions  */
// Staff Access 
// Get Questions
function getQuestion(input, sendFunc) {
    const { token, data } = input;
    Data_model.runAuthorization(token, Data_model.AUTH_ROLES.Staff, sendFunc, (send) => { Data_model.getQuestion(data.search, send) }); 
}

function getReport({ data, token }, sendFunc) {
    const { people, questions, dates } = data;
    if (Array.isArray(people)) {
        Data_model.runAuthorization(token, Data_model.AUTH_ROLES.Admin, sendFunc, (send) => { Data_model.getReport(people, questions, dates, send) }); 
    } else {
        Data_model.runAuthorization(token, Data_model.AUTH_ROLES.Staff, sendFunc, (send) => { Data_model.getReport(people, questions, dates, send) }); 
    }
}

// Admin Access 
// Get Staff Members
function getStaff(input, sendFunc) {
    const { token, data } = input;
    Data_model.runAuthorization(token, Data_model.AUTH_ROLES.Admin, sendFunc, (send) => { Data_model.getStaff(data.search, send) }); 
}

module.exports = { 
    getAllSubmissions, 
    attemptLogin,
    getQuestion,
    getReport,
    getStaff
};