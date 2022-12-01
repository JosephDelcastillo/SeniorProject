// Import 
const { Users, Sessions } = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');
const Reply = require('../lib/Reply');
const tb = require('../lib/Helpers');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };

async function Create (data) {
    return new Promise(resolve => {
        const { id } = data;

        // Replace with New User ID or other reference 
        resolve({ id, table: table.id });
    });
}

async function GetStaff (search) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT u.id, u.archived, u.name, u.email
            FROM u 
            WHERE u.type LIKE "staff" AND ( u.name LIKE "%${search}%" OR u.email LIKE "%${search}%" )
            ORDER BY u.name`

        // Search DB For Matches  
        const { resources } = await Users.items
            .query(query)
            .fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

// *** Authorization ***
function Login ({email, password}) {
    return Promise(resolve => {
        let search = db_dev.Users.rows.find(u => tb.strLike(u.email, email));
        if ( typeof search === "undefined" ) {
            resolve(new Reply({ point: 'Find User' })) 
        }

        let user = db_dev.Users.rows.find(u => tb.strLike(u.password, password));
        if( typeof user === "undefined" ) {
            resolve(new Reply({ point: 'Authenticate User' }))
        } 
        // TODO: Add to sessions and return valid key 
        resolve(new Reply({ data: 'jds8a-AD78B-a79NiP-as89CNj', success: true, point: 'Login'}))
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
        // TODO: Resolve with Reply 
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