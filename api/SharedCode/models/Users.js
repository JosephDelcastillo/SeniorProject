// Import 
const db = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');
const tb = require('../lib/Helpers');

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
        const staff = (search) ? db_dev.Users.filter(({ name, email }) => tb.strLike(name, search) || tb.strLike(email, search) ) : db_dev.Users.rows;
        // Format Data for Security 
        const output = staff.map(({ id, name, email }) => { return ({ id, name, email }); }); 
        // Return Data 
        resolve( output );
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
        // TODO: If Valid Token -> Return user id 
        if ( token ) resolve(true);
        
        // TODO: If invalid Token -> Return false 
        resolve(false)
    })
}

module.exports = {
    AUTH_ROLES,
    Authorize,
    GetStaff,
    Login,
    Create
}