// Imports 
const service = require('../SharedCode/services/Submissions');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (!req.body) {
        return context.res = {
            status: 400,
            body: "Please pass data to the request body"
        };
    } 

    try {
        const data = req.body;
        
        // TODO: ADD NECESSARY PARAMETERS TO CHECK BELOW
        if (!data.data) { 
            return context.res = {
                status: 400,
                body: "Please pass data in the request body"
            };
        }

        const result = await service.GetSubmission(data);
        if(!result) {
            return context.res = {
                status: 400,
                body: "Service Failed to Execute"
            };
        } 
        return context.res = {
            body: result
        };
    } catch (error) {
        return context.res = {
            status: 500,
            body: error 
        };
    }
}