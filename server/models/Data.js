/**
 *  Data Model
 *
 *  Handles the Interactions with the Database
 */
 
// Imports
const { DummyDB } = require('../helpers/Development'); // TODO: Remove After Development
const { Reply } = require('../helpers/Helpers');
 
// Dummy Data
let db = DummyDB(); // TODO: Replace with DB connection
 
// **** Load Data ****
function getAllSubmissions (sendFunc) {
    let output = [];
   
    // First Get Submissions
    db.Submissions.rows.forEach(current => {
        let finds = db.Responses.rows.filter(({submission}) => submission === current.id);
        finds.forEach(({submission, question, value}) => { 
            output.push({user: current.user, submission: submission, date: current.date, question: question, value: value});
        });
    });
   
    output = output.sort((a, b) => (a.user - b.user) + ((a.submission - b.submission)));
    sendFunc(new Reply ({ point: `Get All Submissions`, success: true, data: output }));
}


//Will grab data for all users
//Not fully tested!!! No error handling etc!!!!
function getUsers (sendFunc) {
    let output = [];

    //TODO: Grab archival status
    db.Users.rows.forEach(current => {
        output.push({name: current.name, email: current.email, role: current.role});
    })

    output = output.sort((a, b) => (a.user - b.user));
    sendFunc(new Reply ({ point: `Get All Users`, success: true, data: output }));
}
 
// **** Add Data ****
 
//Will add a new user to the dummy database
//Does no error handling or anything else rn
//Currently not fully tested...
function addUser ({name, email, password, role}, sendFunc) {
    //TODO have it check to make sure the user doesn't already exist
 
    db.Users.addEntry({ name: name, email: email, password: password, role: role });
 
    sendFunc( new Reply ({ data: '', point: 'Add User', success: true }));
}


// **** Update Data ****
// **** Remove Data ****
 
 
// *** Authorization ***
function attemptLogin ({username, password}, sendFunc) {
    let search = db.Users.rows.find(({username}) => username == username);
    if ( typeof search === "undefined" ) {
        sendFunc( new Reply ({ data: { username: username, password: password }, point: 'Attempt Login' }) );
        return true;
    }
 
    let user = db.Users.rows.find(({password}) => password == password);
    if( typeof user === "undefined" ) {
        sendFunc( new Reply ({ data: { username: username, password: password }, point: 'Attempt Password Authorization' }) );
        return true;
    }
    sendFunc( new Reply ({ data: 'jds8a-AD78B-a79NiP-as89CNj', point: 'Attempt Login', success: true }) )
}
 
/**
 * Run Authorization
 * @param {string} token Authorization Token
 * @param {Function} sendFunc To Return Data
 * @param {Function} successAction Action to do if authorized
 */
function runAuthorization (token, sendFunc, successAction) {
    // TODO: Fill this in with an actual token processor
    // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration
    return true;
}
 
/**
 * Export Functions For Public Use Here
 */
module.exports = {
    getAllSubmissions, attemptLogin, addUser, getUsers
};
