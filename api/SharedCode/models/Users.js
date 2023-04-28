// Import 
const { Users, Sessions } = require('../lib/DBConnection');
const tb = require('../lib/Helpers');
const nodemailer = require('nodemailer');

// Constants 
const AUTH_ROLES = { Admin: 'Administrator', Staff: 'Staff' };

//Creates a New User
async function Create ({name, email, type}) {
    return new Promise(async resolve => {
        //checks to make sure all needed info is filled in
        if (!name || !email || !type){
            resolve(false);
            return;
        }

        //checks if user already exists
        let queryUsers = `SELECT u.email
        FROM u 
        WHERE u.email LIKE "${email.toLowerCase()}"`
    
        const { resources } = await Users.items.query(queryUsers).fetchAll();

        //if email already in use, send back a false
        if (!resources.length == 0) {
            resolve(false);
            return;
        } 

        //check that email is an email
        let emailValid = /\S+@\S+\.\S+/;
        if (!emailValid.test(email)) {
            resolve(false);
            return;
        }

        //generate salt
        const salt = await tb.genSalt();

        //generate id number to store as password
        const password = await tb.genId();
        const saltPass = await tb.hashing(password, salt);

        //generate actual id
        const userId = await tb.genId();

        //Check if the id is already in use
        const idQuery = `SELECT u.name
        FROM u 
        WHERE u.id LIKE "${userId}"`
        let idCheck = await Users.items.query(idQuery).fetchAll();

        //generates new id if in use already
        if (!idCheck.length == 0) {
            const userId = await tb.genId();
        }

        //generate reset token info
        let resetToken = "";
        let tsalt = "";

        //Generates token without a / (because it will mess up the link)
        do {
            //generates new salt
            tsalt = await tb.genSalt();

            //hashes new token
            resetToken = await tb.hashing(email, tsalt);
        } while (resetToken.includes("/"))

        const now = new Date();
        let query = {};

        //puts everything into database based on user type
        if (type == "admin") {
            query = {
                id: userId,
                archived: false,
                name,
                email: email.toLowerCase(),
                pass: saltPass,
                salt: salt,
                type: "admin",
                f_token: resetToken,
                f_salt: tsalt,
                f_created: now.toISOString()
            };
        } else {
            query = {
                id: userId,
                archived: false,
                name,
                email: email.toLowerCase(),
                pass: saltPass,
                salt: salt,
                type: AUTH_ROLES.Staff,
                f_token: resetToken,
                f_salt: tsalt,
                f_created: now.toISOString()
            };
        }

        const result = await Users.items.create(query);

        //CHANGE WHEN USING TESTING!!!
        clientURL = "https://epots.azurewebsites.net"

        //create reset link
        const link = `${clientURL}/resetpassword/${email}/${resetToken}`;

        //Send reset email
        //Create transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplyepotts@gmail.com',
                pass: 'aegtfvcsxdwhcvcj'
            }
        });
        
          //create message
        var mailOptions = {
            from: 'noreplyepotts@gmail.com',
            to: `${email.toLowerCase()}`,
            subject: 'EPOTS New User Password',
            text: `Hello, 
            An EPOTS account was created for the owner of this email address. Please follow the link to set your password:
            ${link}
            (This set password request will expire in 1 hour)`
        };
        
          //send message
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                resolve(false);
                return;
            }
        });

        resolve(true);
    });
}

//Gets the user info of the currently active user
async function GetCurrentUser (token) {
    return new Promise( async resolve => {
        // Check for a token
        if (!token) {
            resolve (false);
            return;
        }

        // Query for session with that token in session table
        // Get associated user id
        let query = `SELECT u.user
        FROM u WHERE u.token = "${token.token}"`;
        
        const { resources: search } = await Sessions.items.query(query).fetchAll();

        // Make sure that we found the session
        if (search.length == 0) {
            resolve (false);
            return;
        } 

        // Query users for a user matching that id
        let query2 = `SELECT u.type, u.name, u.email
        FROM u WHERE u.id = "${search[0].user}"`;
        
        const { resources: search2 } = await Users.items.query(query2).fetchAll();

        //Make sure that we found the user
        if (search2.length == 0) {
            resolve (false);
            return;
        } 

        resolve(search2);
    })
}

//Gets info of all staff matching a search term (or if no search term, all staff info)
async function GetStaff (search) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT u.id, u.archived, u.name, u.email
            FROM u 
            WHERE LOWER(u.type) LIKE "${AUTH_ROLES.Staff.toLowerCase()}" 
            ${(search && search.length > 0) && (`AND ( u.name LIKE "%${search}%" OR u.email LIKE "%${search}%" )`)}
            ORDER BY u.name`

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
        return resources;
    })
}

//Gets info of all users
async function GetAllUsers(){
    return new Promise(async resolve => {
        const query = `SELECT u.id, u.email, u.name
        FROM u 
        ORDER BY u.email`

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        // Return Result 
        resolve( resources );
    })
}

//Gets info of all staff matching a search term (or if no search term, all staff info)
async function GetUsers (search) {
    return new Promise(async resolve => {

        // Build Query 
        let query = `SELECT u.id, u.archived, u.name, u.email, u.type
            FROM u
            ${search ? ` WHERE u.email LIKE "${search}"`: ""} 
            ORDER BY u.name`

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

//Edits the info of a user
async function Edit ({name, oldemail, email, type}) {
    return new Promise(async resolve => {

        //Getting needed user id info
        let query = `SELECT *
        FROM u
        WHERE u.email LIKE "${oldemail.toLowerCase()}"`

        let {resources} = await Users.items.query(query).fetchAll(); 

        //Make sure user was found
        if (resources.length == 0) {
            resolve(false);
            return;
        }

        //Declaring our needed variables which may or may not be used
        let result = null;
        let updated = null;

        //See if user type was updated
        if (type && !(type == "0")) {

            if ( type == "admin") {
                updated = {...resources[0], type: "admin"};
                result = await Users.items.upsert(updated);

                //User info updated
                if (result) {
                    resources[0]=updated; 
                }
            } else {
                updated = {...resources[0], type: "Staff"};
                result = await Users.items.upsert(updated);

                //User info updated
                if (result) {
                    resources[0]=updated; 
                }
            }
        }

        //See if name was updated
        if (!name == "") {
            updated = {...resources[0], name: name};
            result = await Users.items.upsert(updated);

            //Update stored user info
            if (result) {
                resources[0]=updated;  
            }
        }

        //See if email was updated
        if (!email == "") {
            //checks if email is already in use
            let queryusers = `SELECT u.email, u.name
            FROM u
            WHERE u.email LIKE "${email.toLowerCase()}"`
        
            let resources2 = await Users.items.query(queryusers).fetchAll(); 

            //if email already in use, send back a false
            if (!resources2.resources.length == 0) {
                resolve(false);
                return;
            } 

            //check that email is an email
            let emailValid = /\S+@\S+\.\S+/;
            if (!emailValid.test(email)) {
                resolve(false);
                return;
            }

            updated = {...resources[0], email: email.toLowerCase()};
            result = await Users.items.upsert(updated);
        }

        //Seeing if we updated anything and got a result
        if (result) {
            resolve(true);
            return;
        } else {
            resolve(false);
            return;
        } 
    });
}

//Archives or Unarchives a user account
async function Archive ({email, archive}) {
    return new Promise(async resolve => {

        //Getting needed user id info
        let query = `SELECT *
        FROM u
        WHERE u.email LIKE "${email}"`
        const { resources } = await Users.items.query(query).fetchAll(); 

        //Make sure user was found
        if (resources.length == 0) {
            resolve(false);
            return;
        }

        // Try to change archival status
        if (archive == false) {
            const updated = {...resources[0], archived: true};
            const result = await Users.items.upsert(updated);
        } else {
            const updated = {...resources[0], archived: false};
            const result = await Users.items.upsert(updated);
        }

        resolve (true);

    });
}

//Edits the info of the currently active user
async function EditCurrentUser ({email, name, password, password2, token}) {
    return new Promise(async resolve => {
        
        // Check for a token
        if (!token) {
            resolve (false);
            return;
        }

        // Query for session with that token in session table
        // Get associated user id
        let query = `SELECT u.id, u.user, u.created
        FROM u WHERE u.token = "${token.token}"`;
        
        const { resources : search } = await Sessions.items.query(query).fetchAll();

        //Make sure we found a matching session
        if (search.length == 0) {
            resolve (false);
            return;
        } 

        // Query users for a user matching that id
        let query2 = `SELECT *
        FROM u WHERE u.id = "${search[0].user}"`;
        
        let {resources: user} = await Users.items.query(query2).fetchAll();

        //Make sure that we found the user
        if (user.length == 0) {
            resolve (false);
            return;
        } 

        //Declaring our needed variables which may or may not be used
        let result = null;
        let updated = null;

        //See if email was updated
        if (!email == "") {

            //checks if email is already in use
            let queryusers = `SELECT u.email, u.name
            FROM u
            WHERE u.email LIKE "${email}"`
        
            let resources2 = await Users.items.query(queryusers).fetchAll();


            //if email already in use, send back a false
            if (!resources2.resources.length == 0) {
                resolve(false);
                return;
            } 

            //check that email is an email
            let emailValid = /\S+@\S+\.\S+/;
            if (!emailValid.test(email)) {
                resolve(false);
                return;
            }


            updated = {...user[0], email: email.toLowerCase()};
            result = await Users.items.upsert(updated);

            //Get new info
            if(result){
                user[0] = updated;
            }

        }

        //See if password was updated
        if (password && !(password == "")) {

            //make sure confirm password was filled out
            if (password2 == "") {
                resolve(false);
                return;
            }

            if (password == password2) {
                //Generate new salt and hash for new password
                const salt = await tb.genSalt();
                const saltPass = await tb.hashing(password, salt);

                password = saltPass;

                updated = {...user[0], pass: password, salt: salt};
                result = await Users.items.upsert(updated);

                //Get new info
                if(result){
                    user[0] = updated;
                }
            } else {
                resolve(false);
                return;
            }
        }

        //See if name was updated
        if (!name == "") {
            updated = {...user[0], name: name};
            result = await Users.items.upsert(updated);
        }

        //Seeing if we updated anything and got a result
        if (result) {
            resolve(true);
            return;
        } else {
            resolve(false);
            return;
        } 
    });
}

//Deletes user session and logs them out
async function Logout (token) {
    return new Promise( async resolve => {

        // Check for a token
        if (!token) {
            resolve (true);
            return;
        }

        // Query for session with that token in session table
        let query = `SELECT *
        FROM u WHERE u.token = "${token.token}"`;
        
        const { resources: search } = await Sessions.items.query(query).fetchAll();

        // Make sure that we found the session
        if (search.length == 0) {
            resolve (true);
            return;
        } 

        const something = await Sessions.item(search[0].id , search[0].id).delete();
        resolve(true);
    })
}

//Creates reset token and sends reset password email
async function ForgotPassword ({email}) {
    return new Promise(async resolve => {
        //CHANGE WHEN USING TESTING!!!
        clientURL = "https://epots.azurewebsites.net"
        
        //Query for user info
        let query = `SELECT * 
        FROM u WHERE u.email = "${email.toLowerCase()}" AND u.archived = false`;
        
        const { resources: search } = await Users.items.query(query).fetchAll();
        //Make sure user was found
        if (!search || search.length <= 0) {
            resolve(false);
            return;
        }

        let resetToken = "";
        let salt = "";

        //Generates new token without / (because that will break the link)
        do {
            //generates new salt
            salt = await tb.genSalt();

            //hashes new password
            resetToken = await tb.hashing(email, salt);
        } while (resetToken.includes("/"))

        //store token and date
        const now = new Date();

        const updated = {...search[0], f_token: resetToken, f_salt: salt, f_created: now.toISOString() };
        const result = await Users.items.upsert(updated);

        //create reset link
        const link = `${clientURL}/resetpassword/${email}/${resetToken}`;

        //Send reset email
        //Create transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplyepotts@gmail.com',
                pass: 'aegtfvcsxdwhcvcj'
            }
        });
        
          //create message
        var mailOptions = {
            from: 'noreplyepotts@gmail.com',
            to: `${email.toLowerCase()}`,
            subject: 'EPOTS Password Reset',
            text: `Hello, 
            We received a reset password request for your EPOTS account. Please follow the link to reset your password:
            ${link}
            (This reset request will expire in 1 hour)`
        };
        
          //send message
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                resolve(false);
                return;
            }
        });
        
        resolve(true);
    })
}

//Resets user password
async function ResetPassword ({email, token, password, password2}) {
    return new Promise(async resolve => {

        //Getting needed user id info
        let query = `SELECT *
        FROM u
        WHERE u.email LIKE "${email.toLowerCase()}"`

        const { resources } = await Users.items.query(query).fetchAll(); 

        //Make sure user was found
        if (!resources || resources.length == 0) {
            resolve(false);
            return;
        }

        //Make sure reset token matches
        if (resources[0].f_token != token) {
            resolve(false);
            return;
        }

        //Make sure reset token is valid
        const isAuthorized = (token === await tb.hashing(email, resources[0].f_salt));
        if (!isAuthorized) {
            resolve(false);
            return;
        } 

        //Make sure reset token isn't expired (older than an hour)
        const now = new Date();
        let oneHour = 60 * 60 * 1000;
        if (now - (new Date(resources[0].f_created)) > oneHour ) {

            const updated = {...resources[0], f_token: "", f_salt: "", f_created: ""};
            const result = await Users.items.upsert(updated);
            resolve(false);
            return;
        }

        //Make sure password and confirm password match
        if (password != password2) {
            resolve(false);
            return;
        }

        //generates new salt
        const salt = await tb.genSalt();

        //hashes new password
        const saltPass = await tb.hashing(password, salt);

        // Try to change salt and password. and clear out token data
        const updated = {...resources[0], salt, pass: saltPass, f_token: "", f_salt: "", f_created: ""};
        const result = await Users.items.upsert(updated);

        resolve (true);
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
        FROM u WHERE u.email = "${email.toLowerCase()}" AND u.archived = false`;
        
        const { resources: search } = await Users.items.query(query).fetchAll();
        if (search && search.length <= 0) {
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
            // Checks if user has more than 3 sessions (if yes, delete oldest sessions)

            let query2 = `SELECT *
            FROM u WHERE u.user = "${search[0].id}"
            ORDER BY u.created`;
        
            const { resources: sessions } = await Sessions.items.query(query2).fetchAll();

            if (sessions && (sessions.length > 3)) {
                for (let i = 0 ; i < (sessions.length - 3) ; i++) {
                    const something = await Sessions.item(sessions[i].id , sessions[i].id).delete();
                }
            }
            
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
 * @returns {boolean|object} Returns FALSE or Object { ID: User ID }
 * 
 */
async function Authorize (token, requirement) {
    return new Promise( async resolve => {
        /**
         * Authorization Process
         * 
         * 1) Check for token
         * 2) See if token matches a stored token
         *  2.1)See if token is expired
         *  2.2) See how many sessions user has
         *  2.3) If not valid sessions, delete current session and return false
         * 3) Check for user
         *  3.5) See is user is archived
         * 4) Check to see if roles match
         * 5) Return true and user id if all checks out  
         */

        // Check for a token
        if (!token) {
            resolve (false);
            return;
        }
        

        // Query for session with that token in session table
        let query = `SELECT *
        FROM u WHERE u.token = "${token.token}"`;
        
        const { resources: search } = await Sessions.items.query(query).fetchAll();

        if (search.length == 0) {
            resolve (false);
            return;
        } 

        //check to see if token is older than 12 hours
        const now = new Date();
        const twoHour = 60 * 60 * 1000 * 12;
        if (now - (new Date(search[0].created)) > twoHour) {
            //Delete session!!
            const something = await Sessions.item(search[0].id , search[0].id).delete();
            resolve (false);
            return;
        } else {
            //Update creation to keep it active
            updated = {...search[0], created : now.toISOString()};
            result = await Sessions.items.upsert(updated);
        }

        // Query users for a user matching that id
        let query2 = `SELECT u.type, u.archived
        FROM u WHERE u.id = "${search[0].user}"`;
        
        const { resources: search2 } = await Users.items.query(query2).fetchAll();

        //Make sure we found user
        if (search2.length == 0) {
            resolve (false);
            return;
        } 

        //check to make sure user isn't archived
        if (search2[0].archived == true) {
            resolve(false);
            return;
        }

        // Compare user types
        if ((search2[0].type == "staff" || search2[0].type == "Staff") && requirement == "Staff") {
            resolve({id: search[0].user});
            return;
        }
        if (search2[0].type == "admin" || search2[0].type == "Administrator") {
            resolve({id: search[0].user});
            return;
        }

        resolve(false);
    })
}

//Gets users from array
async function GetUsersFromArray(array = []){
    return new Promise(async resolve => {
        if(array.length < 1) { resolve(false); return false; }

        let query = `SELECT u.id, u.name, u.email FROM u WHERE `
        array.forEach((id, i) => query+=`"${id}" = u.id ${(i<(array.length-1))? "OR ":" "}`);

        // Search DB For Matches  
        const { resources } = await Users.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
        return resources;
    })
}

module.exports = {
    AUTH_ROLES,
    Authorize,
    GetStaff,
    Login,
    Logout,
    Create,
    GetUsers,
    Edit,
    Archive,
    GetCurrentUser,
    GetAllUsers,
    GetUsersFromArray,
    EditCurrentUser,
    ForgotPassword,
    ResetPassword
}