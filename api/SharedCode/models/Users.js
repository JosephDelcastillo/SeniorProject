// Import 
const { Users, Sessions } = require('../lib/DBConnection');
const tb = require('../lib/Helpers');

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


async function GetAllUsers(){
    return new Promise(async resolve => {
        const query = `SELECT u.id, u.email
        FROM u 
        ORDER BY u.email`

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

async function GetUsersFromArray(array = []){
    return new Promise(async resolve => {
        if(array.length < 1) resolve(false);

        let query = `SELECT u.id, u.name, u.email FROM u WHERE `
        array.forEach((id, i) => query+=`"${id}" = u.id ${(i<(array.length-1))? "OR ":" "}`);

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
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
            if(!newSession) resolve(false);
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
    return new Promise(resolve => {
        // TODO: Fill this in with an actual token processor 
        // Note, use the Session table to create/manage the number of users session active at one time or even limit session duration 
        // TODO: If Valid Token -> Return user id 
        if ( token ) resolve('ASD8-ASDc-aaAScds');
        
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
    Create,
    GetAllUsers,
    GetUsersFromArray
}