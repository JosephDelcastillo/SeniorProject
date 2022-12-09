// Import 
const { Questions, Submits, Responses } = require('../lib/DBConnection');
const tb = require('../lib/Helpers');

async function GetQuestion (search, no_notes = false) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT q.id, q.archived, q.text, q.type
            FROM q 
            WHERE q.text LIKE "%${search}%" ${(no_notes)?'AND q.type != "note" ':''}
            ORDER BY q.text`

        // Search DB For Matches  
        const { resources } = await Questions.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}
async function AddSubmission({ user, data }){
    return new Promise(async resolve => {
        /**
         * 1) Create Submit 
         *  a - Build Submit 
         *  b - Add to DB 
         *  c - Check if Success 
         * 2) Create Responses
         *  a - Build Response
         *  b - Add to DB
         *  c - Check if Success 
         *  d - Repeat  
         */

        // Create Submit 
        const now = new Date();
        const submit = {
            id: tb.genId(),
            user, 
            create: now.toISOString(),
            modified_by: "",
            modified: ""
        }
        console.log(submit)

        // Search DB For Matches  
        const { resource: submission } = await Submits.items.create(submit); 

        if(!submission) resolve(false);

        // Create Responses
        let fails = 0;
        data.forEach(async ({ id, value }) => {
            const response = {
                id: await tb.genId(),
                submission: submission.id,
                question: id,
                response: value
            }
            const { resource } = await Responses.items.create(response);
            if(!resource) fails++;
        })
        
        // Return Result 
        resolve(submission.id);
    })
}

async function GetQuestionFromArray (array = []) {
    return new Promise(async resolve => {
        if(array.length < 1) resolve(false)
        // Build Query 
        let query = `SELECT q.id, q.archived, q.text, q.type
            FROM q 
            WHERE `
        array.forEach((item, i) => query += `"${item}" = q.id ${(i < (array.length-1))? "OR " : ""}`)
        console.log(query);
        // Search DB For Matches  
        const { resources } = await Questions.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}


module.exports = {
    GetQuestionFromArray,
    AddSubmission,
    GetQuestion
}