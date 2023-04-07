// Imports 
const service = require('../SharedCode/services/Users');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        const data = req.body;
        const result = await service.Logout(data);

        if(!result) {
            return context.res = {
                status: 400,
                body: "Service Failed to Execute"
            };
        }
        console.log("Made it past the service!"); 
        return context.res = {
            body: result
        };
    } catch (error) {
        context.log('Error in index.js triggered');
        context.log("error in index.js: " + error);
        return context.res = {
            status: 500,
            body: error 
        };
    }
}