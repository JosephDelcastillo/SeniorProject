const model = require('../models/Submissions');
const { Authorize, AUTH_ROLES, GetAllUsers } = require('../models/Users');
const { Reply } = require('../lib/Reply');

// Get Submissions
async function GetAllSubmissions(input) {
    try {
        const { token, data } = input;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin); 
        const isStaff = await Authorize(token, AUTH_ROLES.Staff); 
        let submissions = false;
       
        if(isAdmin){
            submissions = await model.GetAllSubmissions();
        }
        else if(isStaff){
            submissions = await model.GetAllSubmissions(isStaff);
        }
        else if(submissions===false)
        {
        return new Reply({ point: 'Authorization' });
        }

        if(submissions===false){
            return new Reply({point: 'Model'})
        }
        if(submissions.length==0){
            return new Reply({point: 'No Submissions'})
        }

        let users = await GetAllUsers();
        if(!users){
            return new Reply({point: 'Users'})
        }
        users = users.filter(({id}) => submissions.findIndex(({user, modified_by}) => id==user||id==modified_by) >= 0);
        if(users.length > 0){
            return new Reply({point: 'User Inquiry', success: true, data: {submissions, users}});
        }
        return new Reply({ point: 'User Inquiry' });

    } catch (error) {
        return new Reply({ point: 'User Inquiry' });
    }
}


module.exports = {
    GetAllSubmissions
}