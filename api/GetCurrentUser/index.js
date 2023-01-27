// Imports 
const service = require('../SharedCode/services/Users');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        const data = req.body;

        const result = await service.GetCurrentUser(data);
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