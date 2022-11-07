const model = require('../models/Forms');
const { Authorize, AUTH_ROLES } = require('../models/Users');
const { Reply } = require('../lib/Reply');

// Get Questions
async function GetQuestion(input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token, AUTH_ROLES.Staff); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        
        const q = await model.GetQuestion(data.search);
        if(q) return new Reply({ point: 'Question Generation', success: true, data: q });
        return new Reply({ point: 'Question Generation' });
    } catch (error) {
        return new Reply({ point: 'Question Inquiry' });
    }
}

module.exports = {
    GetQuestion
}