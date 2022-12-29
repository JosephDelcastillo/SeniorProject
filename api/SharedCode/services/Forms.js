const model = require('../models/Forms');
const { Authorize, AUTH_ROLES } = require('../models/Users');
const { Reply } = require('../lib/Reply');

// Get Questions
async function GetQuestion(input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token, AUTH_ROLES.Staff); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        
        const q = await model.GetQuestion(data.search, data.no_notes || false);
        if(q) return new Reply({ point: 'Question Generation', success: true, data: q });
        return new Reply({ point: 'Question Generation' });
    } catch (error) {
        return new Reply({ point: 'Question Inquiry' });
    }
}

async function AddSubmission (input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        
        const success = await model.AddSubmission({ user: authorized, data });
        if(success) return new Reply({ point: 'Add Submission', success: true, data: success });
        return new Reply({ point: 'Add Submission' });
    } catch (error) {
        return new Reply({ point: 'Add Submission Inquiry' });
    }
}

module.exports = {
    AddSubmission,
    GetQuestion
}