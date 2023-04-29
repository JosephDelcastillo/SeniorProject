// Import 
const { Questions, Submits, Responses } = require('../lib/DBConnection');
const { genId, sanitize } = require('../lib/Helpers');



async function GetQuestion (search, no_notes = false) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT q.priority, q.id, q.archived, q.text, q.type, q.goals
            FROM q 
            WHERE q.text LIKE "%${search}%" ${(no_notes)?'AND q.type != "note" ':''}
            ORDER BY q.priority`

        // Search DB For Matches  
        const { resources } = await Questions.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}
async function GetQuestionById (id) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT *
            FROM q 
            WHERE q.id = "${id}"`;

        // Search DB For Matches  
        const { resources } = await Questions.items.query(query).fetchAll(); 
        if (!resources || resources.length <= 0) return resolve(false);

        // Return Result 
        return resolve( resources[0] );
    })
}
async function EditQuestion(id, text, type, goals, modified_by){
    return new Promise( async resolve => {
        // First Get Question
        const question = await GetQuestionById(id);
        if (question === false) return resolve(false);

        // Clean Inputs
        if (typeof goals === 'string') goals = parseInt(goals);

        const today = new Date(); 
        const newQuestion = { 
            ...question, 
            text, 
            type, 
            goals, 
            modified_by, 
            modified: today.toISOString() 
        };
        const { resource } = await Questions.items.upsert(newQuestion);
        return resolve(sanitize(resource));
    })

}
async function ArchiveQuestion(id, status, user){
    return new Promise(async resolve => {
        // Get Question
        const question = await GetQuestionById(id);
        if(question === false) return resolve(false);

        // Update 
        const today = new Date(); 
        const newQuestion = { 
            ...question, 
            archived: status, 
            modified_by: user, 
            modified: today.toISOString() 
        };
        const { resource: output } = await Questions.items.upsert(newQuestion);

        // Return Result 
        return resolve(sanitize(output));
    })
}
async function OrderChange(id, priority, modified_by){
    return new Promise( async resolve=> {
        const question = await GetQuestionById(id);
        if (question === false) return resolve(false);

        const today = new Date(); 
        const newQuestion = { 
            ...question, 
            priority, 
            modified_by, 
            modified: today.toISOString() 
        };

        const { resource: output } = await Questions.items.upsert(newQuestion);
        return resolve(sanitize(output));
    })
}
async function AddQuestion({ text, type }){
    return new Promise(async resolve => {
        const now = new Date();
        const newQuestion = {
            priority:20,
            id: await genId(),
            text,
            type,
            goals: 0,
            archived: false,
            created: now.toISOString() 
        };
        
        const { resource: submission } = await Questions.items.create(newQuestion);
        if(!submission) { resolve(false); return false; } 

        resolve(sanitize(submission));
        return sanitize(submission)
    });
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
            id: await genId(),
            user, 
            created: now.toISOString(),
            modified_by: "",
            modified: ""
        }
        console.log(submit)

        // Search DB For Matches  
        const { resource: submission } = await Submits.items.create(submit); 

        if(!submission) { resolve(false); return false; }

        // Create Responses
        let fails = 0;
        data.forEach(async ({ id, value }) => {
            const response = {
                id: await genId(),
                submission: submission.id,
                question: id,
                response: value
            }
            const { resource } = await Responses.items.create(response);
            if(!resource) fails++;
        })
        
        // Return Result 
        resolve(submission.id);
        return submission.id
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
    GetQuestionById,
    ArchiveQuestion,
    EditQuestion,
    AddSubmission,
    GetQuestion,
    AddQuestion,
    OrderChange
}