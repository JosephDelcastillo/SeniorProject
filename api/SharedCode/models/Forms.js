// Import 
// const db = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');
const tb = require('../lib/Helpers');

// Constants 
// const table = db.GetTable(db.TABLES.User);

async function GetQuestion (search) {
    return new Promise(resolve => {
        // Search DB For Matches  
        const question = (search) ? db_dev.Questions.filter( ({ name, is_note }) => (tb.strLike(name, search) && !(is_note)) ) : db_dev.Questions.filter(({ is_note })=> !is_note) ;
        // Format Data for Security 
        const output = question.map(({ id, name }) => { return ({ id, name }); }); 
        // Return Data 
        resolve( output );
    })
}

module.exports = {
    GetQuestion
}