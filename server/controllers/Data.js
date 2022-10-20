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

/* Private Functions  */
// Get Staff Members
function getStaff(input, sendFunc) {
    const { token, data } = input;
    Data_model.runAuthorization(token, sendFunc, (send) => { Data_model.getStaff(data, send) }); 
}

module.exports = { 
    getAllSubmissions, 
    attemptLogin,
    getStaff
};