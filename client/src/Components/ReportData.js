import DateView from "./DateView";

function ReportData(data) {
    // Final Structure [{ question: Question #, data: [{ name: Employee Name, data: [{ name: Submission #, y: Submission Value }] }] }]
    // First Get Questions 
    let prep = data.questions.map(({ id, text, goal }) => { return {name: text, question: id, goal: goal ? goal : undefined } });
    // Next Add Employees to each Question 
    prep.map(e => e.data = data.people.map(({id, name}) => { return { name, person: id } }));
    // Then Add Submission to Each Question/Employee 
    prep.map(q => q.data.map(p => p.data = data.submissions.filter(s => s.user === p.person).map(s => {
        return { name: 'Submission ' + DateView(s.created), submission: s.id }}
    )) )
    // Then Add Responses to Each Submission
    prep.map(q => q.data.map(p => p.data.forEach(s => {
        let found = data.responses.find(r => (r.submission === s.submission && r.question === q.question));
        s.y = (found && found.response) ? found.response : 0;
    })));
    // Finally Remove all the helper values from the object
    let output = prep.map(({ name, data, goal }) => { 
        return { name, goal, data: data.map(({ name, data }) => {
            return { name, data: data.map(({ name, y }) => { 
                return { name, y: parseInt(y) } 
            })}
        })} 
    }); 
    return output;
}

export default ReportData