// Import 
const { Questions } = require('../lib/DBConnection');
const tb = require('../lib/Helpers');

async function GetQuestion (search) {
    return new Promise(async resolve => {
        // Build Query 
        const query = `SELECT q.id, q.archived, q.text, q.type
            FROM q 
            WHERE q.text LIKE "%${search}%"
            ORDER BY q.text`

        // Search DB For Matches  
        const { resources } = await Questions.items.query(query).fetchAll(); 
        
        // Return Result 
        resolve( resources );
    })
}

module.exports = {
    GetQuestion
}