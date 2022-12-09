// Imports 
const service = require('../SharedCode/services/Users');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log('req: ' + req);
    if (!req.body) {
        return context.res = {
            status: 400,
            body: "Please pass data to the request body"
        };
    } 

    try {
        const data = req.body;
        
        if (!data.data) { 
            return context.res = {
                status: 400,
                body: "Please pass data into the request body"
            };
        }

        console.log('Started')
        console.log(data)
        const result = await service.Login(data);

        console.log("result in index is: " + result);
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
        context.log('Error in index.js triggered');
        context.log("error in index.js: " + error);
        return context.res = {
            status: 500,
            body: error 
        };
    }
}