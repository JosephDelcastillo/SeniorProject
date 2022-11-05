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
function getAllSubmissions(sendFunc) {
    let output = [];

    // First Get Submissions 
    db.Submissions.rows.forEach(current => {
        let finds = db.Responses.rows.filter(({ submission }) => submission === current.id);
        finds.forEach(({ submission, question, value }) => {
            output.push({ user: current.user, submission: submission, question: question, value: value });
        });
    });

    output = output.sort((a, b) => (a.user - b.user) + ((a.submission - b.submission)));
    sendFunc(new Reply({ point: `Get All Submissions`, success: true, data: output }));
}

// **** Add Data **** 
// **** Update Data **** 
// **** Remove Data **** 


//****Get All User Entries*****
function getAllEntries(sendFunc) {
    let output = [];
    var myEntries = [];

    //TO DO: USE TOKEN TO GET VERIFY CURRENT USER AND ROLE
    let curUser = 'userA@email.com';
    let curUserRole = 'staff';
    db.Entries.rows.forEach(current => {
        output.push({ email: current.email, entryDate: current.entryDate, lastEdit: current.lastEdit, editDate: current.editDate });
    });
    //Set filter to only see appropriate entries
    if (curUserRole == 'staff') {
        output.filter(entries => entries.email === curUser).forEach(({ email, entryDate, lastEdit, editDate }) => {
            myEntries.push({ email: email, entryDate: entryDate, lastEdit: lastEdit, editDate: editDate });
        });
    }
    else {
        myEntries = output;
    }
    sendFunc(new Reply({ point: `Get All Entries`, success: true, data: myEntries }));
}

// *** Authorization ***
function attemptLogin({ username, password }, sendFunc) {
    let search = db.Users.rows.find(({ username }) => username == username);
    if (typeof search === "undefined") {
        sendFunc(new Reply({ data: { username: username, password: password }, point: 'Attempt Login' }));
        return true;
    }

    let user = db.Users.rows.find(({ password }) => password == password);
    if (typeof user === "undefined") {
        sendFunc(new Reply({ data: { username: username, password: password }, point: 'Attempt Password Authorization' }));
        return true;
    }
    sendFunc(new Reply({ data: 'jds8a-AD78B-a79NiP-as89CNj', point: 'Attempt Login', success: true }))
}

/**
 * Run Authorization 
 * @param {string} token Authorization Token
 * @param {Function} sendFunc To Return Data
 * @param {Function} successAction Action to do if authorized
 */
function runAuthorization(token, sendFunc, successAction) {
    // TODO: Fill this in with an actual token processor
    // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration 
    return true;
}

/**
 * Export Functions For Public Use Here 
 */
module.exports = {
    getAllSubmissions, attemptLogin, getAllEntries
};