// Import 
const { Submits, Responses, Questions, Users } = require('../lib/DBConnection');
const { sanitize } = require('../lib/Helpers');

async function Get (people, questions, dates) {
    return new Promise(async resolve => {
        //******** 1: Build the Submission Query ********
        let query = `SELECT * FROM s WHERE `;
        // Build People 
        if(!people.includes(-202)) {
            query += "("
            people.forEach(p => query += `s.user LIKE "%${p}%" OR `);
            query = query.substring(0, query.length - 3) + ") AND ";
        }
        // Build Dates 
        query += `( s.created > "${dates.start}" AND (s.created < "${dates.end}" OR s.created LIKE "${dates.end}%"))`;
        console.log(query)
        //******** 2: Get the Submissions ********
        // Search DB For Matches  
        const submissionData = await Submits.items.query(query).fetchAll();

        // Resolve if none found 
        if(submissionData.resources.length < 1) { resolve([]); return []; }
        console.log(submissionData)
        //******** 3: Build the Response Query ********
        query = `SELECT * FROM r WHERE `;
        // Build Questions 
        if(!questions.includes(-202)) {
            query += "( "
            questions.forEach(q => query += `r.question LIKE "%${q}%" OR `);
            query = query.substring(0, query.length - 3) + ") AND ";
        }
        // Re-Add in Submissions
        query += "( "
        submissionData.resources.forEach(s => query += `r.submission LIKE "%${s.id}%" OR `);
        query = query.substring(0, query.length - 3) + ")";

        //******** 4: Get the Responses ********
        // Search DB For Matches  
        console.log(query)
        const responseData = await Responses.items.query(query).fetchAll();

        //******** 5: Get the Questions ********
        query = `SELECT * FROM q `;
        if(!questions.includes(-202)) {
            query += "WHERE "
            questions.forEach(q => query += `q.id LIKE "%${q}%" OR `);
            query = query.substring(0, query.length - 3);
        }
        const questionData = await Questions.items.query(query).fetchAll();
        
        //******** 6: Filter out the Note Questions ********
        const notes = questionData.resources.filter(({ type }) => type && type.toLowerCase() === "note").map(({id}) => id);
        const f_questions = questionData.resources.filter(({ type }) => type && type.toLowerCase() !== "note")
        const f_responses = responseData.resources.filter(({ question }) => !notes.includes(question) );

        //******** 7: Get the Users ********
        query = `SELECT u.id, u.name, u.email FROM u `;
        if(!people.includes(-202)) {
            query += "WHERE "
            people.forEach(p => query += `u.id LIKE "%${p}%" OR `);
            query = query.substring(0, query.length - 3);
        }
        const userData = await Users.items.query(query).fetchAll();
        
        // Finally Return Information 
        resolve({ 
            submissions: sanitize(submissionData.resources), 
            responses: sanitize(f_responses), 
            questions: sanitize(f_questions), 
            people: sanitize(userData.resources)
        });
    })
}


module.exports = {
    Get
}