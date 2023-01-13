// Imports 
const service = require('../SharedCode/services/Helper');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log.verbose('Landed at TestBackEnd')
    if (!req.body) {
        return context.res = {
            status: 400,
            body: "Please pass data to the request body"
        };
    } 

    try {
        const data = req.body;
        
        const result = await service.TestHelper(data);

        return context.res.body = result ;
    } catch (error) {
        return context.res = {
            status: 500,
            body: error 
        };
    }
}