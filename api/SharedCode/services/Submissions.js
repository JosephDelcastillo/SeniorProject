const model = require('../models/Submissions');
const { Authorize, AUTH_ROLES, GetAllUsers, GetUsersFromArray } = require('../models/Users');
const { Reply } = require('../lib/Reply');
const { GetQuestionFromArray } = require('../models/Forms');

// Get Submissions
async function GetAllSubmissions(input) {
    try {
        const { token, data } = input;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        const isStaff = await Authorize(token, AUTH_ROLES.Staff);
        let submissions = false;

        if (isAdmin) {
            // submissions = await model.GetAllSubmissions();
        }
        else if (isStaff) {
            // submissions = await model.GetAllSubmissions(isStaff);
        }
        else if (submissions === false) {
            return new Reply({ point: 'Authorization' });
        }

        if (submissions === false) {
            return new Reply({ point: 'Model' })
        }
        if (submissions.length == 0) {
            return new Reply({ point: 'No Submissions' })
        }

        let users = await GetAllUsers();
        if (!users) {
            return new Reply({ point: 'Users' })
        }
        users = users.filter(({ id }) => submissions.findIndex(({ user, modified_by }) => id == user || id == modified_by) >= 0);
        if (users.length > 0) {
            return new Reply({ point: 'User Inquiry', success: true, data: { submissions, users } });
        }
        return new Reply({ point: 'User Inquiry' });

    } catch (error) {
        return new Reply({ point: 'User Inquiry' });
    }
}

async function GetSubmission(input) {
    try {
        /* Get Submission Data Steps
         * 1. Submission Data - data.id
         * 2. User Data - submission.user | submission.modified_by
         * 3. Response Data - data.id 
         * 4. Question Data - response.question
        */

        const { token, data } = input;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        const isStaff = await Authorize(token, AUTH_ROLES.Staff);
        let submissions = false;
        
        //********  Step 1: Get Submission Data ********/
        if (isAdmin) {
            submissions = await model.GetSubmission(data);
        } else if (isStaff) {
            submissions = await model.GetSubmission(data);
        } else if (submissions === false) {
            return new Reply({ point: 'Authorization' });
        }
        
        if (submissions === false) return new Reply({ point: 'Model' })
        if (submissions.length == 0) return new Reply({ point: 'No Submissions' })
        //********  Step 2: Get User Data ********/
        let idFromSubmit = []; 
        submissions.forEach(({user, modified_by}) => idFromSubmit.push(user, modified_by))
        const uniqueUserIds = idFromSubmit.filter((id, i) => (idFromSubmit.indexOf(id) === i));
        const users = await GetUsersFromArray(uniqueUserIds) 
        if(!users||users.length < 1) return new Reply({point: 'User Inquiry'})
        
        //********  Step 3: Get Response Data ********/
        const responses = await model.GetResponsesFromSubmit(data);
        console.log(responses);        
        if(!responses||responses.length < 1) return new Reply({point: 'Responses Inquiry'})

        //********  Step 4: Get Question Data ********/
        idFromSubmit = []; 
        responses.forEach(({question}) => idFromSubmit.push(question))
        console.log(idFromSubmit);
        const questions = await GetQuestionFromArray(idFromSubmit)
        if(!questions||questions.length < 1) return new Reply({point: 'Question Inquiry'})

        return new Reply({ point: 'Submission Inquiry', data: {submissions, users, responses, questions}, success: true});
    } catch (error) {
        return new Reply({ point: 'Submission Inquiry' });
    }
}


module.exports = {
    GetAllSubmissions, GetSubmission
}