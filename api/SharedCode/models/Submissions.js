// Import 
const { Submits, Responses } = require('../lib/DBConnection');
const { Submissions } = require('../lib/DBDevelopment');
const tb = require('../lib/Helpers');

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
        const query = `SELECT * FROM r WHERE "${id}" = r.id`;
        
        // Get Response
        const { resources } = await Responses.items.query(query).fetchAll();
        if(!resources || resources.length <= 0) return resolve (false);
        
        // Update Response 
        const newResponse = {...resources[0], response: response, };
        const { resource: output } = await Responses.items.upsert(newResponse);

        // Get Submission
        const submissionQuery = `SELECT * FROM r WHERE "${output.submission}" = r.id`;
        const { resources: submissions } = await Submits.items.query(submissionQuery).fetchAll();
        if(!submissions || submissions.length <= 0) return resolve (false);

        // Update Submission
        const today = new Date();
        const newSubmission = {...submissions[0], modified_by: user, modified: today.toISOString() };
        const { resource: submission } = await Submits.items.upsert(newSubmission);

        return resolve(tb.sanitize(output));
    })

}

async function Archive(id, status, userId){
    return new Promise( async resolve=> {
        const query = `SELECT *
        FROM s 
        WHERE "${id}" = s.id`
        

        const { resources } = await Submits.items.query(query).fetchAll();

        if(!resources || resources.length<=0){  
           return resolve ("Failed to find submission");
        }
        const today = new Date(); 
        const updated = { ...resources[0], archived: status, modified: today.toISOString(), modified_by: userId};

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