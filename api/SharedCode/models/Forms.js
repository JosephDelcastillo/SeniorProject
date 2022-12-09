// Import 
const { Questions } = require('../lib/DBConnection');
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
    GetQuestion, GetQuestionFromArray
}