const model = require('../models/Reports');
const { Authorize, AUTH_ROLES } = require('../models/Users');
const { Reply } = require('../lib/Reply'); 


async function Get(input) {
    try {
        const { token, data } = input;
        const { people, questions, dates } = data;
        if (Array.isArray(people)) {
            const authorized = await Authorize( token, AUTH_ROLES.Admin); 
            if(!authorized) return new Reply({ point: 'Authorization' });
            
            const report = await model.Get( people, questions, dates );
            if(report) return new Reply({ point: 'Get Report', data: report, success: true });
            return new Reply({ point: 'Report Generation' });
        } else {
            const authorized = await Authorize( token, AUTH_ROLES.Staff); 
            if(!authorized) return new Reply({ point: 'Authorization' });
            
            // Note: Since Authorized returns the user id, it can be substituted here 
            const report = await model.Get([ authorized ], questions, dates );
            if(report) return new Reply({ point: 'Get Report', data: report, success: true });
            return new Reply({ point: 'Report Generation' });
        }
    } catch (error) {
        return new Reply({ point: 'Report Inquiry' });
    }
}

module.exports = {
    Get,
}