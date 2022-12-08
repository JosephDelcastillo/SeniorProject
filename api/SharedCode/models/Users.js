// Import 
const { Users, Sessions } = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');
const Reply = require('../lib/Reply');
const tb = require('../lib/Helpers');
const jwt = require('jsonwebtoken');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };

//used to just accept data
async function Create ({name, email, password, type}) {
    return new Promise(async resolve => {
        console.log(name + email + password + type);

        //checks if user already exists
        let queryUsers = `SELECT u.email
            FROM u 
            WHERE u.type LIKE "staff" AND ( u.name LIKE "%${email}%" OR u.email LIKE "%${email}%" )
            ORDER BY u.name`
        
            const { resources } = await Users.items.query(queryUsers).fetchAll();

            //if email already in use, send back a false
            if (resources) {
               resolve(false);
            } 

            //check that email is an email
            let emailValid = /\S+@\S+\.\S+/;
            if (!emailValid.test(email)) {
                resolve(false);
            }

            
            const salt = await tb.genSalt();
            console.log(salt);

            const saltPass = await tb.hashing(password, salt);
            console.log(saltPass);

            const userId = await tb.genId();
            console.log(userId);

            //Check if the id is already in use
            const idQuery = `SELECT u.name
            FROM u 
            WHERE u.id LIKE "${search}"`
            let idCheck = await Users.items.query(idQuery).fetchAll();

            //generates new id if in use already
            if (idCheck) {
                const userId = await tb.genId();
                console.log(userId);
            }

                //puts everything into database
                const query = {
                    id: userId,
                    archived: false,
                    name,
                    email,
                    pass: saltPass,
                    salt: salt,
                    type: AUTH_ROLES.Staff,
                    f_token: "",
                    f_salt: "",
                    f_created: ""
                };

                console.log(query);
                const result = await Users.items.create(query);
                console.log(result);

       resolve(true);
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
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

// *** Authorization ***
async function Login ({email, password}) {
    return Promise(async resolve => {
        let search = db_dev.Users.rows.find(u => tb.strLike(u.email, email));
        if ( typeof search === "undefined" ) {
            resolve(new Reply({ point: 'Find User' })) 
        }

        /*  //Checks password against hash
        const auth = tb.compareHashes(password, search.hash);
        if (auth) {
            let todayDate = new Date();
            //Make token with found user and user salt
            //TODO: Figure out what actually needs to be in the token
            const token = jwt.sign({search}, 'salt???', { expiresIn: '48h' });

            //TODO: insert into user table
            const query = `UPDATE u
            SET (f_token = "%${token}%", f_salt = "%${search}%", f_created = "%${todayDate}%")
            WHERE u.id LIKE "%${search.id}%" `

            //Put in DB  
            const result = await Users.items.query(query);

            const sessionId = tb.genId();

            //TODO: insert into session table
                const querys = {
                    id: sessionId,
                    user: search.id,
                    token: token,
                    created: todayDate
                };

                const success = await Sessions.items.create(querys);

            resolve(new Reply({ data: token, success: true, point: 'Login'}))
        } else {
            resolve(new Reply({ point: 'Authenticate User' }))
        } */

         let user = db_dev.Users.rows.find(u => tb.strLike(u.password, password));
        if( typeof user === "undefined" ) {
            resolve(new Reply({ point: 'Authenticate User' }))
        }  
        //TODO: Add to sessions and return valid key 
        //resolve(new Reply({ data: 'jds8a-AD78B-a79NiP-as89CNj', success: true, point: 'Login'}))
        //resolve(new Reply({ data: token, success: true, point: 'Login'}))
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