// Imports 
// const service = require('../services/Users');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const id = await service.GetUsersTableId();
    // TODO: Replace With Validation Service 
    const valid = {
        success: (req.query && req.query.id), 
        message: "Please pass a id on the query string or in the request body"
    }

    if (valid.success) { 
        context.res = {
            status: 200,
            body: req.query.id
        };
        // service.Create(context, req.query)
    }
    else {
        context.res = {
            status: 400,
            body: valid.message
        };
    }
}