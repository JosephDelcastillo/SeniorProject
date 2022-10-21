/**
 *  Data Model 
 * 
 *  Handles the Interactions with the Database 
 */

// Imports 
const { DummyDB } = require('../helpers/Development'); // TODO: Remove After Development
const { Reply } = require('../helpers/Helpers');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };

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

function getStaff (search, sendFunc) {
    // Search DB For Matches  
    const staff = (search) ? db.Users.filter(({ name, email }) => strSearch(name, search) || strSearch(email, search) ) : db.Users.rows;
    // Format Data for Security 
    const output = staff.map(({ id, name, email }) => { return ({ id, name, email }); }); 
    // Return Data 
    sendFunc(new Reply ({ point: `Get Staff`, success: true, data: output }));
}

function getQuestion (search, sendFunc) {
    // Search DB For Matches  
    const question = (search) ? db.Questions.filter( ({ name, is_note }) => (strSearch(name, search) && !(is_note)) ) : db.Questions.filter(({is_note })=>!is_note) ;
    // Format Data for Security 
    const output = question.map(({ id, name }) => { return ({ id, name }); }); 
    // Return Data 
    sendFunc(new Reply ({ point: `Get Question`, success: true, data: output }));
}

function getReport (people, questions, dates, sendFunc) {
    let output = { people, questions, dates };
    // First Get Submissions Within TimeSpan 
    const subs = (people[0] === -202) ? db.Submissions.filter(({date}) => (date >= dates.start && date <= dates.end)) : 
        db.Submissions.filter(({user, date}) => (date >= dates.start && date <= dates.end) && people.includes(user) );
    // Next Collect Responses Based on Submissions and Questions
    const questionsFiltered = (questions[0] === -202) ? 
        db.Questions.filter(({ is_note }) => !is_note).map(({id, name})=>{return {id, name}}) : 
        db.Questions.filter(({ id, is_note }) => !is_note && questions.includes(id)).map(({id, name})=>{return{id, name}});
    // Next Get Responses Per the Submissions
    const resp = db.Responses.filter(({ submission, question }) => (subs.findIndex(({id}) => id === submission) >= 0) && (questionsFiltered.findIndex(q => q.id === question) >= 0));
    // Then Get Users 
    const pep = (people[0] === -202) ? db.Users.rows.map(({ id, name }) => { return { id, name } }) : db.Users.rows.filter(({id})=>people.includes(id)).map(({ id, name }) => { return { id, name } });
    // Finally Return Information 
    sendFunc(new Reply ({ point: 'Generate Report', success: true, data: { submissions: subs, responses: resp, questions: questionsFiltered, people: pep } }));
}

// **** Add Data **** 
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
function runAuthorization (token, requirement, sendFunc, successAction) {
    // TODO: Fill this in with an actual token processor
    // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration 
    if ( token ) {
        successAction(sendFunc);
    } else {
        sendFunc( new Reply({ data: token, point: 'Authorization' }) );
    }
}

// *** Helper Funcitons *** 
function strSearch(haystack, needle) {
    return (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0); 
}

/**
 * Export Functions For Public Use Here 
 */
module.exports = {
    AUTH_ROLES,
    getAllSubmissions, 
    runAuthorization,
    attemptLogin, 
    getQuestion,
    getReport,
    getStaff
};