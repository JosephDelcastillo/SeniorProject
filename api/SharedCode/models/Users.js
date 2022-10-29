// Import 
const db = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };
const table = db.GetTable(db.TABLES.User);

async function Create (data) {
    return new Promise(resolve => {
        const { id } = data;

        // Replace with New User ID or other reference 
        resolve({ id, table: table.id });
    });
}

async function GetStaff (search) {
    return new Promise(resolve => {
        // Search DB For Matches  
        const staff = (search) ? db_dev.Users.filter(({ name, email }) => strSearch(name, search) || strSearch(email, search) ) : db_dev.Users.rows;
        // Format Data for Security 
        const output = staff.map(({ id, name, email }) => { return ({ id, name, email }); }); 
        // Return Data 
        resolve( output );
    })
}

async function GetQuestion (search) {
    return new Promise(resolve => {
        // Search DB For Matches  
        const question = (search) ? db_dev.Questions.filter( ({ name, is_note }) => (strSearch(name, search) && !(is_note)) ) : db_dev.Questions.filter(({is_note })=>!is_note) ;
        // Format Data for Security 
        const output = question.map(({ id, name }) => { return ({ id, name }); }); 
        // Return Data 
        resolve( output );
    })
}

async function GetReport (people, questions, dates) {
    return new Promise(resolve => {
        let output = { people, questions, dates };
        // First Get Submissions Within TimeSpan 
        const subs = (people[0] === -202) ? db_dev.Submissions.filter(({date}) => (date >= dates.start && date <= dates.end)) : 
            db_dev.Submissions.filter(({user, date}) => (date >= dates.start && date <= dates.end) && people.includes(user) );
        // Next Collect Responses Based on Submissions and Questions
        const questionsFiltered = (questions[0] === -202) ? 
            db_dev.Questions.filter(({ is_note }) => !is_note).map(({id, name})=>{return {id, name}}) : 
            db_dev.Questions.filter(({ id, is_note }) => !is_note && questions.includes(id)).map(({id, name})=>{return{id, name}});
        // Next Get Responses Per the Submissions
        const resp = db_dev.Responses.filter(({ submission, question }) => (subs.findIndex(({id}) => id === submission) >= 0) && (questionsFiltered.findIndex(q => q.id === question) >= 0));
        // Then Get Users 
        const pep = (people[0] === -202) ? db_dev.Users.rows.map(({ id, name }) => { return { id, name } }) : db_dev.Users.rows.filter(({id})=>people.includes(id)).map(({ id, name }) => { return { id, name } });
        // Finally Return Information 
        resolve({ submissions: subs, responses: resp, questions: questionsFiltered, people: pep });
    })
}

// *** Authorization ***
function Login ({username, password}) {
    return Promise(resolve => {
        let search = db.Users.rows.find(({username}) => username == username);
        if ( typeof search === "undefined" ) {
            resolve(false)
        }

        let user = db.Users.rows.find(({password}) => password == password);
        if( typeof user === "undefined" ) {
            resolve(false)
        } 
        resolve({ data: 'jds8a-AD78B-a79NiP-as89CNj'})
    })
}

/**
 * Run Authorization 
 * @param {string} token Authorization Token
 * @param {Function} sendFunc To Return Data
 * @param {Function} successAction Action to do if authorized
 */
async function Authorize (token, requirement) {
    return new Promise(resolve => {
        // TODO: Fill this in with an actual token processor
        // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration 
        if ( token ) resolve(true);
        
        resolve(false)
    })
}

// *** Helper Funcitons *** 
const strSearch = (haystack, needle) => (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0); 

module.exports = {
    AUTH_ROLES,
    GetQuestion,
    Authorize,
    GetReport,
    GetStaff,
    Login,
    Create
}