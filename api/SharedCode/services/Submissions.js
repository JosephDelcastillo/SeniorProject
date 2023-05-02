const model = require('../models/Submissions');
const { Authorize, AUTH_ROLES, GetAllUsers, GetUsersFromArray } = require('../models/Users');
const { Reply } = require('../lib/Reply');
const { GetQuestionFromArray } = require('../models/Forms');

// Get Submissions
async function GetAllSubmissions(input) {
    try {
        //Check for Authorization and User Authorization Level
        const { token, data } = input;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        const isStaff = await Authorize(token, AUTH_ROLES.Staff);
        let submissions = false;

        if (isAdmin) {
            //If user is admin, run GetAllSubmissions wide open
            submissions = await model.GetAllSubmissions();
        }
        else if (isStaff) {
            //If user is staff, run GetAllSubmissions only for user ids that match the authorized users id
            submissions = await model.GetAllSubmissions(isStaff.id);
        }
        else if (submissions === false) {
            //If neither admin or staff, user is not authorized, return fail message
            return new Reply({ point: 'Authorization' });
        }

        if (submissions === false) {
            //If no return message, notify user that the error is with the model
            return new Reply({ point: 'Model' })
        }
        if (submissions.length == 0) {
            //If submissions are returned but a blank list is returned, return "No Submissions" error. 
            return new Reply({ point: 'No Submissions' })
        }

        //*****This section is used for updating the modified and modified_by values of a submission*****//
        //Get user id for submission
        let users = await GetAllUsers();
        if (!users) {
            //If there is somehow now user for the submission, return error
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
            //Check if user is authorized as an admin
            submissions = await model.GetSubmission(data);
        } else if (isStaff) {
            //Check is user is authorized as staff.
            submissions = await model.GetSubmission(data);
        } else if (submissions === false) {
            //If user is neither admin or staff, return authorization error
            return new Reply({ point: 'Authorization' });
        }
        //If model fails to return submissions, or if it returns an array of length 0, then return an error.
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
        if(!responses||responses.length < 1) return new Reply({point: 'Responses Inquiry'})

        //********  Step 4: Get Question Data ********/
        idFromSubmit = []; 
        responses.forEach(({question}) => idFromSubmit.push(question))
        const questions = await GetQuestionFromArray(idFromSubmit)
        if(!questions||questions.length < 1) return new Reply({point: 'Question Inquiry'})

        return new Reply({ point: 'Submission Inquiry', data: {submissions, users, responses, questions}, success: true});
    } catch (error) {
        return new Reply({ point: 'Submission Inquiry' });
    }
}

async function EditResponse(input){
    try{
        const { token, data } = input;
        //Check user authorization
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        const isStaff = await Authorize(token, AUTH_ROLES.Staff);
        if (!isAdmin && !isStaff) return new Reply({ point: 'Authorization' });

        const {id, response} = data;
        //Check to ensure there is a valid id and response passed in
        if(!id || !response) return new Reply({point: 'Edit Response - Missing Id or Response', data })
        
        //Calls Edit model to 
        const output = isAdmin ? await model.Edit(id, response, isAdmin.id) : await model.Edit(id, response, isStaff.id);
        if(!output) return new Reply({point: 'Failed to Update Response Content', data});
        
        return new Reply({point: 'Response Updated', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Response Content Update Inquiry' });
    }
}

async function ArchiveSubmission(input) {
    try{
        /**
         * Step 1. Authorize Token
         * Step 2. Ensure good submission id
         * Step 3. Update Archive Status
         * Step 4. Return submission on success
         */
        const { token, data } = input;
        const {submissionId, archiveStatus} = data;
        //Check authorization
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        const isStaff = await Authorize(token, AUTH_ROLES.Staff);

        //Step 1: Check for authorization
        if(!isAdmin && !isStaff) return new Reply({ point: 'Archive Submission Inquiry; Bad Token' });
        //Step 2: Ensure good submission id
        const submission = await model.GetSubmission(submissionId);
        if(!submission && submission.length <= 0 && (submission.user != isStaff.id || !isAdmin)) return new Reply({ point: 'Staff Not Authorized to Archive' });
        //Step 3: Update the archival status
        const userId = isAdmin ? isAdmin.id : isStaff.id; 
        const output = await model.Archive(submissionId, archiveStatus, userId);
        //Step 4: Return submission on success
        if(!output || typeof output === "string") return new Reply({ point: 'Cannot Update Database'});
        return new Reply({point: 'Archiving the Submission', success: true, data: output});

    } catch (error) {
        return new Reply({ point: 'Archive Submission Inquiry' });
    }
}

module.exports = {
    GetAllSubmissions, 
    GetSubmission, 
    EditResponse,
    ArchiveSubmission
}