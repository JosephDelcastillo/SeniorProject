// Import 
const { Submits, Responses } = require('../lib/DBConnection');
const { Submissions } = require('../lib/DBDevelopment');
const tb = require('../lib/Helpers');

//*****Query Database for All Submissions that match a provided userId. If no userId is passed, return all submissions *****//
async function GetAllSubmissions (userId = false) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT s.id, s.user, s.created, s.modified_by, s.modified, s.archived
            FROM s 
            ${(userId===false)? "" : `WHERE "${userId}" = s.user`}
            ORDER BY s.modified DESC`

        // Search DB For Matches  
        const { resources } = await Submits.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
        return resources;
    })
}

//*****Query Database to return submission details for a submissionId that is passed in *****//
async function GetSubmission(submissionId){
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT s.id, s.user, s.created, s.modified_by, s.modified, s.archived
        FROM s 
        WHERE "${submissionId}" = s.id
        ORDER BY s.modified DESC`

        // Search DB For Matches  
        const { resources } = await Submits.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
        return resources;
    })
}
//*****Query Database for Individual Responses(Answers to Questions) for a specific submissionId that is passed in *****/
async function GetResponsesFromSubmit(submissionId){
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT r.id, r.submission, r.question, r.response
        FROM r 
        WHERE "${submissionId}" = r.submission`
    
        // Search DB For Matches  
        const { resources } = await Responses.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
        return resources;
    })
}

async function Edit(id, response, user){
    return new Promise( async resolve => {
        //Build Query
        const query = `SELECT * FROM r WHERE "${id}" = r.id`;
        
        // Get Response
        const { resources } = await Responses.items.query(query).fetchAll();

        //Failure condition
        if(!resources || resources.length <= 0) return resolve (false);
        
        // Update Response 
        const newResponse = {...resources[0], response: response, };
        const { resource: output } = await Responses.items.upsert(newResponse);

        // Get Submission
        const submissionQuery = `SELECT * FROM r WHERE "${output.submission}" = r.id`;
        const { resources: submissions } = await Submits.items.query(submissionQuery).fetchAll();
        //If no submission then return error
        if(!submissions || submissions.length <= 0) return resolve (false);

        // Update Submission
        const today = new Date();
        //Set newSubmission Variable to be in a format that allows DB update. Include new modified_by and modified information
        const newSubmission = {...submissions[0], modified_by: user, modified: today.toISOString() };
        //Update the DB
        const { resource: submission } = await Submits.items.upsert(newSubmission);

        return resolve(tb.sanitize(output));
    })

}

//*****Query Database for the submission ID passed in, update the Archival Status based on passed in Status, update modified and modified_by *****//
async function Archive(id, status, userId){
    return new Promise( async resolve=> {
        //Build Query
        const query = `SELECT *
        FROM s 
        WHERE "${id}" = s.id`
        
        //Query the Database
        const { resources } = await Submits.items.query(query).fetchAll();
        
        //Check to ensure the submission exists
        if(!resources || resources.length<=0){  
           return resolve ("Failed to find submission");
        }
        const today = new Date(); 
        //Build data into a format that can be used to update the database. Include new archival status, modified, and modified_by information
        const updated = { ...resources[0], archived: status, modified: today.toISOString(), modified_by: userId};
        
        //Update the database
        const { resource: output } = await Submits.items.upsert(updated);

       return resolve( {id: output.id, modified: output.modified, modified_by: output.modified_by, archived: output.archived, user: output.user});
    })
}


module.exports = {
    GetAllSubmissions, 
    GetSubmission, 
    GetResponsesFromSubmit, 
    Archive,
    Edit
}