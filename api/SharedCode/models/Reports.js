// Import 
// const db = require('../lib/DBConnection');
const db_dev = require('../lib/DBDevelopment');

// Constants 
// const table = db.GetTable(db.TABLES.User);

async function Get (people, questions, dates) {
    return new Promise(resolve => {
        // First Get Submissions Within TimeSpan 
        const subs = (people[0] === -202) ? db_dev.Submissions.filter(({date}) => (date >= dates.start && date <= dates.end)) : 
            db_dev.Submissions.filter(({user, date}) => (date >= dates.start && date <= dates.end) && people.includes(user) );
        // Next Collect Responses Based on Submissions and Questions
        const questionsFiltered = (questions[0] === -202) ? 
            db_dev.Questions.filter(({ is_note }) => !is_note).map(({id, name})=>{return {id, name}}) : 
            db_dev.Questions.filter(({ id, is_note }) => !is_note && questions.includes(id)).map(({id, name})=>{return{id, name}});
        // Next Get Responses Per the Submissions
        const resp = db_dev.Responses.filter(({ submission, question }) => (subs.findIndex(({id}) => id === submission) >= 0) && (questionsFiltered.findIndex(q => q.id === question) >= 0));
        // Then Get Users 
        const pep = (people[0] === -202) ? db_dev.Users.rows.map(({ id, name }) => { return { id, name } }) : db_dev.Users.rows.filter(({id})=>people.includes(id)).map(({ id, name }) => { return { id, name } });
        // Finally Return Information 
        resolve({ submissions: subs, responses: resp, questions: questionsFiltered, people: pep });
    })
}


module.exports = {
    Get
}