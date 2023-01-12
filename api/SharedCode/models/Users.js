// Import 
const { Users, Sessions } = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');
const Reply = require('../lib/Reply');
const tb = require('../lib/Helpers');
const jwt = require('jsonwebtoken');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };


async function Create ({name, email, password, type}) {
    return new Promise(async resolve => {
        console.log(name + email + password + type);

        //checks if user already exists
        let queryUsers = `SELECT u.email
            FROM u 
            WHERE u.type LIKE "staff" AND ( u.name LIKE "%${email.toLowerCase()}%" OR u.email LIKE "%${email.toLowerCase()}%" )
            ORDER BY u.name`
        
            const { resources } = await Users.items.query(queryUsers).fetchAll();

            //if email already in use, send back a false
            if (resources) {
               resolve(false);
               return;
            } 

            //check that email is an email
            let emailValid = /\S+@\S+\.\S+/;
            if (!emailValid.test(email)) {
                resolve(false);
                return;
            }

            
            const salt = await tb.genSalt();
            console.log(salt);
            console.log("^ salt")

            const saltPass = await tb.hashing(password, salt);
            console.log(saltPass);
            console.log("^ salted password")

            const userId = await tb.genId();
            console.log(userId);
            console.log("^ userID")

            //Check if the id is already in use
            const idQuery = `SELECT u.name
            FROM u 
            WHERE u.id LIKE "${userId}"`
            let idCheck = await Users.items.query(idQuery).fetchAll();

            //generates new id if in use already
            if (idCheck) {
                const userId = await tb.genId();
                console.log(userId);
            }

            //puts everything into database based on user type
            if (type == "admin") {
                const query = {
                    id: userId,
                    archived: false,
                    name,
                    email,
                    pass: saltPass,
                    salt: salt,
                    type: AUTH_ROLES.Admin,
                    f_token: "",
                    f_salt: "",
                    f_created: ""
                };
            } else {
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
            }

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

async function Edit ({name, oldemail, email, type}) {
    return new Promise(async resolve => {
        console.log(name + email + type);

            let updateQuery = `UPDATE u
            SET `

            //See if email was updated
            if (email) {
                console.log(email);

                //check that email is an email
                let emailValid = /\S+@\S+\.\S+/;
                if (!emailValid.test(email)) {
                    resolve(false);
                    return;
                }

                let emailQuery = `email = "%${email}%"`
                updateQuery = updateQuery.concat(emailQuery);

            }

            //See if name was updated
            if (name) {
                console.log(name);

                let nameQuery = ` name = "%${name}%"`
                updateQuery = updateQuery.concat(nameQuery);
            }

            //See if user type was updated
            if (type) {
                console.log(type);

                if ( type == "admin") {
                    let typeQuery = ` type = Administrator`
                    updateQuery = updateQuery.concat(typeQuery);
                } else {
                    let typeQuery = ` type = Staff`
                    updateQuery = updateQuery.concat(typeQuery);
                }
            }


            let endQuery = ` WHERE u.name LIKE "%${oldemail}%" OR u.email LIKE "%${oldemail}%"`
            updateQuery = updateQuery.concat(endQuery);


                console.log(updateQuery);
            //TODO!!! fix users bug to prevent messing up my Account before uncommenting the below lines
                //const result = await Users.items.query(query);
                //console.log(result);

       resolve(true);
    });
}

// *** Authorization ***
async function Login ({email, password}) {
    return new Promise(async resolve => {
        /**
         * Login Process
         * 
         * 1) Query for Matching Email
         * 2) Authorize Pass 
         *      *3) Query Matching Session
         * 4) Create Session 
         * 5) Return Token and Attr: User Type  
         */
        /******** Step 1: Query for Matching Email ********/
        let query = `SELECT u.id, u.name, u.type, u.pass, u.salt
        FROM u WHERE u.email = "${email.toLowerCase()}"`;
        
        console.log('Pre-query')
        const { resources: search } = await Users.items.query(query).fetchAll();
        if (search && search.length <= 0) {
            console.log(search)
            resolve(false);
            return;
        }
        
        /******** Step 2: Authorize Password ********/
        const isAuthorized = search[0].pass === await tb.hashing(password, search[0].salt);
        if (!isAuthorized) {
            resolve(false);
            return;
        } else {
            
            /******** Step 3: Check Session ********/
            // TODO: Fill this Out 
            
            /******** Step 4: Creation Session ********/
            const CurrentUser = search[0];
            
            const now = new Date();
            const session = {
                id: await tb.genId(),
                user: CurrentUser.id,
                token: await tb.genId(),
                created: now.toISOString()
            }
            
            const { resource: newSession } = await Sessions.items.create(session);
            if(!newSession) {
                resolve(false);
                return;
            }

            console.log(newSession.token);
            console.log("^ token");

            /******** Step 5: Return Token ********/
            resolve ({ token: newSession.token, attr: CurrentUser.type });
        }
    })
}

/**
 * Run Authorization 
 * @param {string} token Authorization Token
 * @param {Function} sendFunc To Return Data
 * @param {Function} successAction Action to do if authorized
 */
async function Authorize (token, requirement) {
    return new Promise( async resolve => {
        /**
         * Authorization Process
         * 
         * 1) Check for token
         * 2) See if token matches a stored token
         *  2.5)See if token is expired
         * 3) Check for user
         *  3.5) See is user is archived
         * 4) Check to see if roles match
         * 5) Return true and user id if all checks out  
         */

        console.log("starting authorization check");
        console.log(requirement);


        // Check for a token
        if (!token) {
            resolve (false);
            return;
        }

        console.log("parsing token:");
        let tokenObj = JSON.parse(token);
        console.log(tokenObj);

        console.log("token:");
        console.log(tokenObj.token);

        console.log("end authorization check");

        // Query for session with that token in session table
        let query = `SELECT u.id, u.user, u.created
        FROM u WHERE u.token = "${tokenObj.token}"`;
        
        console.log('session Query')
        const { resources: search } = await Sessions.items.query(query).fetchAll();

        if (!search) {
            resolve (false);
            return;
        } 

        console.log(search);

        console.log(search[0].user);

        // Query users for a user matching that id
        let query2 = `SELECT u.type
        FROM u WHERE u.id = "${search[0].user}"`;
        
        console.log('User Query')
        const { resources: search2 } = await Users.items.query(query2).fetchAll();

        if (!search2) {
            resolve (false);
            return;
        } 

        console.log(search2);

        // Compare user types

        if (search2[0].type == "admin" && requirement == "Administrator") {
            console.log("Auth success");
            resolve({id: search[0].user});
            return;
        }

        if (search2[0].type == "staff" && requirement == "Staff") {
            console.log("Auth success");
            resolve({id: search[0].user});
            return;
        }

        // TODO: Fill this in with an actual token processor 
        //???? ^
        // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration 
        // TODO: If Valid Token -> Return user id 
        
        // TODO: If invalid Token -> Return false 
        // TODO: Resolve with Reply 
        console.log("Auth failed");
        resolve(false);
    })
}

module.exports = {
    AUTH_ROLES,
    Authorize,
    GetStaff,
    Login,
    Create,
    Edit
}