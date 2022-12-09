// Import 
const { Submits, Responses } = require('../lib/DBConnection');
const tb = require('../lib/Helpers');

async function GetAllSubmissions (userId = false) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT s.id, s.user, s.created, s.modified_by, s.modified
            FROM s 
            ${(userId===false)? "" : `WHERE "${userId}" = s.user`}
            ORDER BY s.modified DESC`

        // Search DB For Matches  
        const { resources } = await Submits.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

async function GetSubmission(submissionId){
    return new Promise(async resolve=> {
        // Build Query 
        const query = `SELECT s.id, s.user, s.created, s.modified_by, s.modified
        FROM s 
        WHERE "${submissionId}" = s.id
        ORDER BY s.modified DESC`

        // Search DB For Matches  
        const { resources } = await Submits.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

async function GetResponsesFromSubmit(submissionId){
    return new Promise(async resolve=> {
        // Build Query 
        const query = `SELECT r.id, r.submission, r.question, r.response
        FROM r 
        WHERE "${submissionId}" = r.submission`
    
        // Search DB For Matches  
        const { resources } = await Responses.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}



module.exports = {
    GetAllSubmissions, GetSubmission, GetResponsesFromSubmit
}